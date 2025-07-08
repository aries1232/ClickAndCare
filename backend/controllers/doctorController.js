import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import { logAdminAction } from '../utils/adminLogger.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'ClickAndCare - Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">ClickAndCare</h2>
                    <h3>Email Verification</h3>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #2563eb; font-size: 32px; margin: 0;">${otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

// Send OTP for email verification
const sendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Check if doctor already exists
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.json({ success: false, message: "Doctor with this email already exists! Please login." });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database (create temporary record)
        await doctorModel.findOneAndUpdate(
            { email },
            { 
                email,
                otp,
                otpExpiry,
                emailVerified: false
            },
            { upsert: true, new: true }
        );

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.json({ success: false, message: "Failed to send OTP. Please try again." });
        }

        res.json({ 
            success: true, 
            message: "OTP sent successfully to your email" 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify OTP
const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" });
        }

        // Find doctor with this email and OTP
        const doctor = await doctorModel.findOne({ 
            email, 
            otp,
            otpExpiry: { $gt: new Date() }
        });

        if (!doctor) {
            return res.json({ success: false, message: "Invalid OTP or OTP expired" });
        }

        // Mark email as verified
        await doctorModel.findByIdAndUpdate(doctor._id, {
            emailVerified: true,
            otp: null,
            otpExpiry: null
        });

        res.json({ 
            success: true, 
            message: "Email verified successfully! You can now complete your registration." 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api for doctor signup
const signupDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Check if email is verified
        const existingDoctor = await doctorModel.findOne({ email });
        if (!existingDoctor || !existingDoctor.emailVerified) {
            return res.json({ success: false, message: "Please verify your email first" });
        }

        //checking duplicate doctor 
        const checkemail = await doctorModel.findOne({email, name: { $exists: true, $ne: null }});
        if(checkemail) {
            return res.json({ success: false, message: "Doctor Already Exist ! Please Login :)" });
        }

        // Validating email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to cloudinary if provided
        let imageURL = null;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageURL = imageUpload.secure_url;
        }

        // Parse address only if it's a string
        let parsedAddress = address;
        try {
            if (typeof address === 'string') {
                parsedAddress = JSON.parse(address);
            }
        } catch (error) {
            return res.json({ 
                success: false, 
                message: "Invalid address format"
             });
        }

        const doctorData = {
            name,
            email,
            image: imageURL,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            approved: false, // New doctors are not approved by default
            date: Date.now(),
            emailVerified: true // Already verified
        };

        // Update the existing record with complete doctor data
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            existingDoctor._id,
            doctorData,
            { new: true }
        );

        res.json({ 
            success: true, 
            message: "Registration successful! Please wait for admin approval."
         });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api for doctor login in the admin panel

const loginDoctor = async(req,res) => {
  try {

    const {email,password} = req.body
    const doctor  = await doctorModel.findOne({email});

    if(!doctor) {
      return res.json({ success: false, message: "Invalid Credentials :)" });
    }

    // Check if doctor is approved
    if(!doctor.approved) {
      return res.json({ success: false, message: "Your account is pending approval. Please contact admin." });
    }

    // Check if password exists
    if (!doctor.password) {
      return res.json({ success: false, message: "Invalid Credentials :)" });
    }

    const isMatch = await bcrypt.compare(password,doctor.password);

    if(isMatch) {
      const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);
      res.json({success:true,token});
       
    }else {
      return res.json({ success: false, message: "Invalid Credentials :)" });
    }


    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message});
    
  }
}


// api for changing availablity 
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }  
    );

    // Log the availability change
    await logAdminAction(
      'CHANGE_DOCTOR_AVAILABILITY',
      `Changed availability for Dr. ${docData.name} to ${updatedDoctor.available ? 'Available' : 'Unavailable'}`,
      docId,
      docData.name,
      {
        previousStatus: docData.available,
        newStatus: updatedDoctor.available,
        doctorEmail: docData.email
      },
      req
    );

    res.json({ success: true, message: "Availability Updated", doctor: updatedDoctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all doctors (for frontend - only approved doctors with profile pictures)
const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ 
            approved: true, 
            image: { $ne: null },
            visible: { $ne: false } // Only return visible doctors
        }).select(['-password -email']);  

        res.json({ success: true, doctors}); 
    } catch (error) {
        console.error(error.message);  
        res.status(500).json({ success: false, message: error.message }); 
    }
};

// get all appointments for a particular doctor 

const appointmentsDoctor = async(req,res) => {
  try {
    const docId = req.doctor.id;

    const appointments = await appointmentModel.find({docId}); 

    res.json({success:true,appointments});
    
  } catch (error) {
    console.error(error.message);  
    res.status(500).json({ success: false, message: error.message }); 
    
  }

}

//api to makr appointment completed for doctor panel
const appointmentComplete = async(req,res)=>{
  try {

    const docId = req.doctor.id;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if(appointmentData&& appointmentData.docId===docId){
      
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({success:true,message:"Appointment Completed"})
    }
    else
    {
      return res.json({success:false,message:"Mark Failed"})
    }

    
  } catch (error) {

    console.log(error)
    res.json({success:false,message:error.message})
    
  }
}

//api to cancel appointment completed for doctor panel
const appointmentCancel = async(req,res)=>{
  try {

    const docId = req.doctor.id;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if(appointmentData&& appointmentData.docId===docId){
      
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({success:true,message:"Appointment Cancelled"})
    }
    else
    {
      return res.json({success:false,message:"Cancelled Failed"})
    }

    
  } catch (error) {

    console.log(error)
    res.json({success:false,message:error.message})
    
  }
}


// api to get dasboard data ffor doctor panel
const doctorDashboard = async(req,res) => {
  try {

    const docId = req.doctor.id;

    const appointments = await appointmentModel.find({docId});

    const totalAppointments = appointments.length;

    let earnings= 0;

    appointments.map((item)=>{
      if(item.isCompleted||item.payment){ 
        earnings+=item.amount;
      }
    })

    let patients = [];

    appointments.map((item)=>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId);
      }
    })

    const dashData ={
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData});


    
  } catch (error) {

    console.log(error)
    res.json({success:false,message:error.message})
    
  }
}


// api to get doctor profile data
const doctorProfile = async (req,res) => {
  try {

    const docId = req.doctor.id;

    const doctorData = await doctorModel.findById(docId).select('-password');

    res.json({success:true,doctorData})
  } catch (error) {
    console.error(error.message);
    res.json({success:false,message:error.message})
    
  }
}

// api to update doctor profile data
const updateDoctorProfile = async (req,res) => {
  try {

    const docId = req.doctor.id;
    const { fees, address, available, about } = req.body;

    await doctorModel.findByIdAndUpdate(docId,{fees,address,available,about});

    res.json({success:true,message:"Profile Updated"})
  } catch (error) {
    console.error(error.message);
    res.json({success:false,message:error.message})
    
  }
}

// api to update doctor profile picture
const updateProfilePicture = async (req,res) => {
  try {
    const docId = req.doctor.id;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "No image file provided" });
    }

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageURL = imageUpload.secure_url;

    // Update doctor profile with new image
    await doctorModel.findByIdAndUpdate(docId, { image: imageURL });

    res.json({ success: true, message: "Profile picture updated", imageURL });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}

// Fetch chat messages for an appointment
const getAppointmentChatMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) return res.status(400).json({ success: false, message: 'Missing appointmentId' });
    
    const conversation = await Conversation.findOne({ appointmentId })
      .populate({
        path: 'messages',
        options: { sort: { createdAt: 1 } },
      });
    
    if (!conversation) return res.status(404).json({ success: false, message: 'No chat found for this appointment' });
    
    // Transform messages to match ChatBox expected format
    const transformedMessages = conversation.messages.map(msg => ({
      _id: msg._id,
      sender: msg.senderId,
      message: msg.message,
      messageType: msg.messageType,
      fileUrl: msg.fileUrl,
      fileName: msg.fileName,
      fileSize: msg.fileSize,
      status: msg.status,
      deliveredAt: msg.deliveredAt,
      readAt: msg.readAt,
      time: new Date(msg.createdAt).toLocaleTimeString(),
      createdAt: msg.createdAt
    }));
    
    res.json({ success: true, messages: transformedMessages });
  } catch (err) {
    console.error('Doctor API: Error in getAppointmentChatMessages:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get unread counts for doctor's appointments
const getUnreadCounts = async (req, res) => {
  try {
    const docId = req.doctor.id;
    console.log('Doctor API: Getting unread counts for doctor:', docId);

    // Get all appointments for the doctor
    const appointments = await appointmentModel.find({ docId });
    console.log('Doctor API: Found appointments:', appointments.length);

    const unreadCounts = {};

    for (const appointment of appointments) {
      const conversation = await Conversation.findOne({ appointmentId: appointment._id });
      if (conversation) {
        console.log('Doctor API: Found conversation for appointment:', appointment._id);
        console.log('Doctor API: Conversation messages count:', conversation.messages.length);
        
        // Get messages where doctor is the receiver and sender is not the doctor
        const actualUnreadMessages = await Message.find({
          _id: { $in: conversation.messages },
          receiverId: docId,
          senderId: { $ne: docId }, // Ensure sender is not the doctor
          status: { $ne: 'read' }
        });
        
        const actualUnreadCount = actualUnreadMessages.length;
        const storedUnreadCount = conversation.unreadCount.get(docId.toString()) || 0;
        
        console.log('Doctor API: Found', actualUnreadCount, 'unread messages for doctor', docId);
        console.log('Doctor API: Unread message details:', actualUnreadMessages.map(msg => ({
          id: msg._id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          status: msg.status
        })));
        
        // If there's a mismatch, update the stored count
        if (actualUnreadCount !== storedUnreadCount) {
          console.log('Doctor API: Syncing unread count - stored:', storedUnreadCount, 'actual:', actualUnreadCount);
          conversation.unreadCount.set(docId.toString(), actualUnreadCount);
          await conversation.save();
        }
        
        unreadCounts[appointment._id.toString()] = actualUnreadCount;
        
        console.log('Doctor API: Appointment', appointment._id, 'has', actualUnreadCount, 'unread messages (synced)');
        console.log('Doctor API: Conversation unreadCount map:', conversation.unreadCount);
      } else {
        unreadCounts[appointment._id.toString()] = 0;
        console.log('Doctor API: No conversation found for appointment', appointment._id);
      }
    }

    console.log('Doctor API: Returning unread counts:', unreadCounts);
    res.json({ success: true, unreadCounts });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.json({ success: false, message: error.message });
  }
};

export { signupDoctor, changeAvailability ,getDoctors , loginDoctor , appointmentsDoctor, appointmentCancel, appointmentComplete,doctorDashboard, updateDoctorProfile, doctorProfile, updateProfilePicture, sendSignupOTP, verifySignupOTP, getAppointmentChatMessages, getUnreadCounts};
