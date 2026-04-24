import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  sendOTPEmail,
  sendAppointmentConfirmation,
  sendPasswordResetOTP,
} from "../utils/emailService.js";
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { getPaginatedMessages } from '../utils/chatPagination.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//API to register user (Step 1: Send OTP)
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password (minimum 8 characters)",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with OTP
    const userData = {
      name,
      email,
      phone: phone || '0000000000', // Use provided phone or default
      password: hashedPassword,
      otp,
      otpExpiry,
    };

    const newUser = new userModel(userData);
    await newUser.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);

    if (emailSent) {
      res.json({
        success: true,
        message:
          "OTP sent to your email. Please check your inbox and verify your email.",
        userId: newUser._id,
      });
    } else {
      // If email fails, delete the user
      await userModel.findByIdAndDelete(newUser._id);
      res.json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to verify OTP (Step 2: Verify OTP)
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Email already verified" });
    }

    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Mark user as verified and clear OTP
    await userModel.findByIdAndUpdate(userId, {
      isVerified: true,
      otp: undefined,
      otpExpiry: undefined,
    });

    // Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to resend OTP
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "Missing User ID" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await userModel.findByIdAndUpdate(userId, {
      otp,
      otpExpiry,
    });

    // Send new OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.name);

    if (emailSent) {
      res.json({
        success: true,
        message: "New OTP sent to your email. Please check your inbox.",
      });
    } else {
      res.json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Enter Your Email Please" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password is Too Small" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//APi to get User profile data

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to update user info

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone) {
      return res.json({ success: false, message: "Required fields missing" });
    }

    const updateData = {
      name,
      phone,
      dob: dob || "Not Selected",
      gender: gender || "Not Selected",
    };

    // Handle address parsing
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (error) {
        updateData.address = { line1: "", line2: "" };
      }
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// BMS-style soft lock window: once a slot is booked but unpaid, it stays
// "taken" for SOFT_LOCK_MS. After that, the next availability query treats
// it as free again — no cron, no TTL needed for correctness.
const SOFT_LOCK_MS = 10 * 60 * 1000;        // booking → first pay click
const PAYMENT_LOCK_MS = 30 * 60 * 1000;     // refreshed when Stripe session opens

const isSlotTaken = async ({ docId, slotDate, slotTime }) => {
  return appointmentModel.findOne({
    docId,
    slotDate,
    slotTime,
    cancelled: false,
    $or: [
      { payment: true },
      { lockExpiresAt: { $gt: new Date() } },
    ],
  });
};

//Api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;

    const user = await userModel.findById(userId);
    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before booking appointments",
      });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor Not Available" });
    }

    const conflict = await isSlotTaken({ docId, slotDate, slotTime });
    if (conflict) {
      return res.json({ success: false, message: "Slot Not Available" });
    }

    const userData = await userModel.findById(userId).select("-password");
    const docDataForRow = docData.toObject ? docData.toObject() : { ...docData };
    delete docDataForRow.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: docDataForRow,
      amount: docData.fees,
      date: Date.now(),
      lockExpiresAt: new Date(Date.now() + SOFT_LOCK_MS),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Best-effort confirmation email; failure mustn't roll back the booking.
    sendAppointmentConfirmation(userData.email, appointmentData, userData.name)
      .catch((e) => console.error('sendAppointmentConfirmation failed:', e));

    res.json({
      success: true,
      message: "Appointment Booked",
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get appointments for the user
const allAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    // Hide rows whose soft-lock has expired without payment — they're
    // effectively abandoned. The row stays in the DB for audit.
    const now = new Date();
    const data = await appointmentModel
      .find({
        userId,
        $or: [
          { payment: true },
          { cancelled: true },
          { lockExpiresAt: { $gt: now } },
        ],
      })
      .sort({ date: -1 });
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to cancel user appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Cancellation also kills any in-flight soft lock so the slot frees
    // immediately for other users.
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      lockExpiresAt: null,
    });

    res.json({ success: true, message: "Appointment Cancelled Successfully!" });
  } catch (error) {
    console.error('cancelAppointment error:', error);
    res.json({ success: false, message: error.message });
  }
};

// api to make payment — opens a Stripe Checkout session and refreshes the
// appointment's soft lock so the slot stays held for the full payment window.
const makePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment was cancelled" });
    }

    if (appointment.payment) {
      return res.json({ success: false, message: "Payment already completed" });
    }

    if (!process.env.STRIPE_SECRET) {
      console.error('STRIPE_SECRET is not set in environment variables');
      return res.json({ success: false, message: "Payment service configuration error" });
    }

    const newLock = new Date(Date.now() + PAYMENT_LOCK_MS);
    await appointmentModel.findByIdAndUpdate(appointmentId, { lockExpiresAt: newLock });

    const stripe = new Stripe(process.env.STRIPE_SECRET);

    // Stripe minimum session duration is 30 minutes; aligning with our lock
    // means an abandoned checkout fires `checkout.session.expired` right
    // around the same time the soft-lock would have lapsed anyway.
    const expiresAt = Math.floor(newLock.getTime() / 1000);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Appointment Booking" },
            unit_amount: appointment.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?appointment_id=${appointmentId}`,
      metadata: { appointmentId },
      expires_at: expiresAt,
    });

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Called by Success.jsx after Stripe redirects back. Verifies the session
// with Stripe (so a random user can't fake a success URL) and returns the
// appointmentId so the page can show real confirmation. Does NOT flip
// `payment` — that's the webhook's job.
const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.json({ success: false, message: "Missing session_id" });
    }
    if (!process.env.STRIPE_SECRET) {
      return res.json({ success: false, message: "Payment service configuration error" });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      return res.json({ success: false, message: "Payment not completed" });
    }
    const appointmentId = session.metadata?.appointmentId;
    res.json({ success: true, appointmentId, paymentStatus: session.payment_status });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Called by Cancel.jsx when Stripe redirects to /cancel — we drop the soft
// lock immediately so the slot reopens without waiting on Stripe's
// `checkout.session.expired` webhook (which can fire up to 30 min later).
const releaseLock = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    if (appointment.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }
    if (appointment.payment) {
      return res.json({ success: false, message: "Payment already completed" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      lockExpiresAt: null,
    });
    res.json({ success: true, message: "Lock released" });
  } catch (error) {
    console.error('releaseLock error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe webhook — the ONLY path that flips `payment: true`. Mounted with
// express.raw() so the signature check works (see app.js). The route is
// unauthenticated by design; Stripe's signature is the auth.
const stripeWebhook = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Stripe webhook env not configured');
      return res.status(500).send('Stripe not configured');
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const appointmentId = event.data.object.metadata?.appointmentId;
      if (appointmentId) {
        await appointmentModel.findByIdAndUpdate(appointmentId, {
          payment: true,
          lockExpiresAt: null,
        });
      }
    } else if (event.type === 'checkout.session.expired') {
      const appointmentId = event.data.object.metadata?.appointmentId;
      if (appointmentId) {
        // Don't auto-cancel — user might have just walked away from the tab.
        // Just expire the lock so the slot is reusable; row stays as a record.
        await appointmentModel.findByIdAndUpdate(appointmentId, { lockExpiresAt: null });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('stripeWebhook error:', error);
    res.status(500).send('Internal error');
  }
};

// API to send forgot password OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User with this email does not exist" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with reset OTP
    await userModel.findByIdAndUpdate(user._id, {
      resetOTP: otp,
      resetOTPExpiry: otpExpiry,
    });

    // Send password reset OTP email
    const emailSent = await sendPasswordResetOTP(email, otp, user.name);

    if (emailSent) {
      res.json({
        success: true,
        message: "Password reset OTP sent to your email. Please check your inbox.",
        userId: user._id,
      });
    } else {
      res.json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify password reset OTP and reset password
const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password (minimum 8 characters)",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOTP !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.resetOTPExpiry) {
      return res.json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset OTP
    await userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetOTP: undefined,
      resetOTPExpiry: undefined,
    });

    res.json({
      success: true,
      message: "Password reset successfully! You can now login with your new password.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch chat messages for an appointment (cursor-paginated, newest page first load)
const getAppointmentChatMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { limit, before } = req.query;
    const result = await getPaginatedMessages({ appointmentId, limit, before });
    if (result.error) return res.status(result.error.status).json({ success: false, message: result.error.message });
    res.json({ success: true, messages: result.messages, hasMore: result.hasMore, nextBefore: result.nextBefore });
  } catch (err) {
    console.error('User API: Error in getAppointmentChatMessages:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get unread counts for user's appointments
const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all appointments for the user
    const appointments = await appointmentModel.find({ userId });

    const unreadCounts = {};

    for (const appointment of appointments) {
      const conversation = await Conversation.findOne({ appointmentId: appointment._id });
      if (conversation) {
        // Get messages where user is the receiver and sender is not the user
        const actualUnreadMessages = await Message.find({
          _id: { $in: conversation.messages },
          receiverId: userId,
          senderId: { $ne: userId }, // Ensure sender is not the user
          status: { $ne: 'read' }
        });

        const actualUnreadCount = actualUnreadMessages.length;
        const storedUnreadCount = conversation.unreadCount.get(userId.toString()) || 0;

        // If there's a mismatch, update the stored count
        if (actualUnreadCount !== storedUnreadCount) {
          conversation.unreadCount.set(userId.toString(), actualUnreadCount);
          await conversation.save();
        }

        unreadCounts[appointment._id.toString()] = actualUnreadCount;
      } else {
        unreadCounts[appointment._id.toString()] = 0;
      }
    }

    res.json({ success: true, unreadCounts });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.json({ success: false, message: error.message });
  }
};

// Reset all unread counts for a user (debug/cleanup endpoint)
const resetAllUnreadCounts = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('User API: Resetting all unread counts for user:', userId);

    // Get all appointments for the user
    const appointments = await appointmentModel.find({ userId });
    console.log('User API: Found appointments:', appointments.length);

    let resetCount = 0;

    for (const appointment of appointments) {
      const conversation = await Conversation.findOne({ appointmentId: appointment._id });
      if (conversation) {
        // Reset unread count to 0
        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();
        resetCount++;
        console.log('User API: Reset unread count for appointment:', appointment._id);
      }
    }

    console.log('User API: Reset unread counts for', resetCount, 'conversations');
    res.json({ success: true, message: `Reset unread counts for ${resetCount} conversations` });
  } catch (error) {
    console.error('Error resetting unread counts:', error);
    res.json({ success: false, message: error.message });
  }
};

// API to handle Google OAuth login
const googleLogin = async (req, res) => {
  try {
    const { googleId, name, email, imageUrl } = req.body;

    if (!googleId || !email) {
      return res.json({ success: false, message: "Missing required Google account details" });
    }

    // Check if user already exists with this email
    let user = await userModel.findOne({ email });

    if (user) {
      // If user exists but without Google ID (registered via regular method)
      if (!user.googleId) {
        // Update the user with Google ID and mark as verified
        user = await userModel.findOneAndUpdate(
          { email },
          {
            googleId,
            authProvider: 'google',
            isVerified: true,
            image: user.image || imageUrl || ''
          },
          { new: true }
        );
      }
    } else {
      // Create new user with Google authentication
      user = new userModel({
        name,
        email,
        googleId,
        authProvider: 'google',
        isVerified: true, // Google accounts are pre-verified
        image: imageUrl || '',
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, message: "Google login successful" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  bookAppointment,
  allAppointments,
  cancelAppointment,
  makePayment,
  verifyPayment,
  releaseLock,
  stripeWebhook,
  forgotPassword,
  resetPassword,
  getAppointmentChatMessages,
  getUnreadCounts,
  resetAllUnreadCounts,
  googleLogin,
};