import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
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
      console.log("login occurred");
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
    const { userId } = req.body;
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
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    
    if (!userId || !name || !phone) {
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
//Api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Check if user is verified
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
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Send confirmation email
    await sendAppointmentConfirmation(
      userData.email,
      appointmentData,
      userData.name
    );

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get appointments for the user
const allAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = await appointmentModel.find({ userId }).sort({ date: -1 });
    //console.log(data);
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to cancel user appointment

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({ sucess: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    const slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled Successfully!" });
  } catch (error) {
    console.log("kyu nhi ho rhi padhai");
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to make payment

const makePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid appointmentId format" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Appointment with ${appointmentData.docData.name}`,
            },
            unit_amount: appointmentData.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `${process.env.FRONTEND_URL}/success/${appointmentId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to update the payment status of the appointment
const updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid appointmentId format" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
    res.json({ success: true, message: "Payment status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
  updatePaymentStatus,
  forgotPassword,
  resetPassword,
  googleLogin,
};
