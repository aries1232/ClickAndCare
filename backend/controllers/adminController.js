import doctorModel from './../models/doctorModel.js';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import AdminLog from '../models/adminLogModel.js';
import Admin from '../models/adminModel.js';
import { logAdminAction, LOG_MESSAGES } from '../utils/adminLogger.js';
import { sendEmail } from '../utils/emailService.js';


const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        //console.log({ name, email, password, speciality, degree, experience, about, fees, address }, imageFile);

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        //checking duplicate doctor 
        const checkemail = await doctorModel.findOne({email});
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

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

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
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        // Log the doctor addition
        await logAdminAction(
            'ADD_DOCTOR',
            `Added new doctor: ${name}`,
            newDoctor._id,
            name,
            {
                email,
                speciality,
                degree,
                experience,
                fees
            },
            req
        );

        res.json({ 
            success: true, 
            message: "Doctor Added"
            
         });
        //  console.log("new doctor added successfully :)")

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api for the getting all doctors (for admin panel - only with profile pictures)
const allDoctors = async(req,res) => {
        try {
            const doctors = await doctorModel.find({ image: { $ne: null } }).select('-password');
            res.json({success : true,doctors});
            
        } catch (error) {
            console.log(error);
            res.json({success:false,
                      message:error.message,
            }); 
        }
    
}

// --- ADMIN CONTROLLER MULTI-ADMIN SUPPORT ---
// All admin actions now use the email from the request body or JWT (req.adminId) to find the admin in the database.
// No use of process.env.ADMIN_EMAIL. All password checks use the DB value. All recovery email actions are per-admin.

// Helper to get admin by req.adminId or email
const getAdminFromRequest = async (req, emailFromBody) => {
    if (req.adminId) {
        return await Admin.findById(req.adminId);
    }
    if (emailFromBody) {
        return await Admin.findOne({ email: emailFromBody });
    }
    return null;
};

// --- LOGIN ---
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // First try to find admin by email (admin email)
        let admin = await Admin.findOne({ email, isActive: true });
        
        // If not found by admin email, try to find by recovery email
        if (!admin) {
            admin = await Admin.findOne({ 
                'recoveryEmails.email': email.toLowerCase(),
                'recoveryEmails.isActive': true,
                isActive: true 
            });
        }
        
        if (!admin) {
            return res.json({ success: false, message: "Invalid credentials!" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials!" });
        }
        
        const token = jwt.sign({ adminId: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });
        
        // Log which email was used for login
        const loginEmailType = email.toLowerCase() === admin.email.toLowerCase() ? 'admin_email' : 'recovery_email';
        await logAdminAction('LOGIN', LOG_MESSAGES.LOGIN, admin._id, admin.email, { 
            loginEmail: email, 
            loginEmailType,
            adminEmail: admin.email 
        }, req);
        
        res.json({ 
            success: true, 
            token,
            adminEmail: admin.email, // Return the actual admin email for reference
            loginEmail: email // Return the email that was used to login
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Api to get all appointments list

const appointmentsAdmin = async(req,res) => {
    try {
        const appointments =await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message , message: "chud gye guru"});
        
    }
}

// api for cancelling the appointment by the admin

const appointmentCancel =async(req,res)=>{
    try {
  
      const { appointmentId} = req.body;
      const appointmentData = await appointmentModel.findById(appointmentId);
  
      
  
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
  
      const {docId,slotDate,slotTime}=appointmentData;
  
      const doctorData= await doctorModel.findById(docId);
  
      const slots_booked=doctorData.slots_booked;
      slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime);
  
  
      await doctorModel.findByIdAndUpdate(docId,{slots_booked});
  
      // Log the appointment cancellation
      await logAdminAction(
          'CANCEL_APPOINTMENT',
          `Cancelled appointment for ${appointmentData.userData?.name || 'Unknown'} with Dr. ${doctorData.name}`,
          appointmentId,
          `${appointmentData.userData?.name || 'Unknown'} - ${doctorData.name}`,
          {
              appointmentDate: slotDate,
              appointmentTime: slotTime,
              doctorName: doctorData.name,
              patientName: appointmentData.userData?.name
          },
          req
      );
      
      res.json({success:true,message:"Appointment Cancelled Successfully!"})
      
    } catch (error) {
      
      console.log("kyu nhi ho rhi padhai");
      console.log(error)
      res.json({success:false,message:error.message})
      
    }
  }

  //api to get dashboard data for admin panel
  const adminDashboard = async(req,res) => {
    try {

        const doctors = await doctorModel.find({});
        const approvedDoctors = await doctorModel.find({ approved: true, image: { $ne: null } });
        const pendingDoctors = await doctorModel.find({ approved: false });
        const users = await userModel.find({});
        const appointment = await appointmentModel.find({});

        const dashData = {
            doctors: approvedDoctors.length,
            pendingDoctors: pendingDoctors.length,
            patients: users.length,
            appointments: appointment.length,
            latestAppointments: appointment.reverse().slice(0, 5),
            };
            res.json({success:true,dashData})
            
        } catch (error) {
            console.log(error);
            res.json({success:false,message:error.message});
        }
}



//api to approve/reject doctor
const approveDoctor = async (req, res) => {
    try {
        const { doctorId, approved } = req.body;
        
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        await doctorModel.findByIdAndUpdate(doctorId, { approved });
        
        const action = approved ? 'APPROVE_DOCTOR' : 'REJECT_DOCTOR';
        const message = approved ? "Doctor approved successfully!" : "Doctor rejected successfully!";
        
        // Log the action
        await logAdminAction(
            action, 
            `${approved ? 'Approved' : 'Rejected'} doctor: ${doctor.name}`, 
            doctorId, 
            doctor.name, 
            { approved, doctorEmail: doctor.email }, 
            req
        );
        
        res.json({ success: true, message });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to get pending doctors (all pending doctors, regardless of profile picture)
const getPendingDoctors = async (req, res) => {
    try {
        const pendingDoctors = await doctorModel.find({ approved: false }).select('-password');
        res.json({ success: true, pendingDoctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to approve all existing doctors (migration helper)
const approveExistingDoctors = async (req, res) => {
    try {
        // Find and approve all doctors that don't have the approved field or are explicitly false
        const result = await doctorModel.updateMany(
            { 
                $or: [
                    { approved: { $exists: false } },
                    { approved: false }
                ]
            },
            { $set: { approved: true } }
        );
        
        res.json({ 
            success: true, 
            message: `Successfully approved ${result.modifiedCount} existing doctors`,
            modifiedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to delete doctor and all related data
const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Delete all appointments related to this doctor
        const deletedAppointments = await appointmentModel.deleteMany({ docId: doctorId });
        
        // Delete the doctor
        await doctorModel.findByIdAndDelete(doctorId);
        
        // Log the deletion
        await logAdminAction(
            'DELETE_DOCTOR',
            `Deleted doctor: ${doctor.name} and ${deletedAppointments.deletedCount} appointments`,
            doctorId,
            doctor.name,
            { 
                deletedAppointments: deletedAppointments.deletedCount,
                doctorEmail: doctor.email,
                doctorSpeciality: doctor.speciality
            },
            req
        );
        
        res.json({ 
            success: true, 
            message: `Doctor ${doctor.name} and ${deletedAppointments.deletedCount} related appointments deleted successfully!`
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to get admin logs
const getAdminLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, startDate, endDate } = req.query;
        
        // Build filter object
        const filter = {};
        if (action) filter.action = action;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }
        
        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get logs with pagination
        const logs = await AdminLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
        
        // Get total count for pagination
        const totalLogs = await AdminLog.countDocuments(filter);
        
        // Get action statistics
        const actionStats = await AdminLog.aggregate([
            { $match: filter },
            { $group: { _id: '$action', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        res.json({
            success: true,
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalLogs / parseInt(limit)),
                totalLogs,
                hasNextPage: skip + logs.length < totalLogs,
                hasPrevPage: parseInt(page) > 1
            },
            stats: {
                totalActions: totalLogs,
                actionBreakdown: actionStats
            }
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- FORGOT PASSWORD ---
const adminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // First try to find admin by email (admin email)
        let admin = await Admin.findOne({ email, isActive: true });
        
        // If not found by admin email, try to find by recovery email
        if (!admin) {
            admin = await Admin.findOne({ 
                'recoveryEmails.email': email.toLowerCase(),
                'recoveryEmails.isActive': true,
                isActive: true 
            });
        }
        
        if (!admin) {
            return res.json({ success: false, message: "Admin account not found. Please use your admin email or any active recovery email." });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        admin.resetOTP = { code: otp, expiresAt: otpExpiry };
        await admin.save();
        
        const activeRecoveryEmails = admin.recoveryEmails.filter(email => email.isActive);
        if (activeRecoveryEmails.length === 0) {
            return res.json({ success: false, message: "No recovery emails configured. Please contact system administrator." });
        }
        
        const emailPromises = activeRecoveryEmails.map(async (recoveryEmail) => {
            try {
                await sendEmail({
                    to: recoveryEmail.email,
                    subject: "Admin Password Reset OTP - ClickAndCare",
                    html: `<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\"><h2 style=\"color: #17de71;\">Admin Password Reset Request</h2><p>Hello ${recoveryEmail.name},</p><p>A password reset request has been made for the ClickAndCare admin account.</p><p><strong>Admin Email:</strong> ${admin.email}</p><p><strong>OTP Code:</strong> <span style=\"font-size: 24px; font-weight: bold; color: #17de71;\">${otp}</span></p><p><strong>Valid until:</strong> ${otpExpiry.toLocaleString()}</p><p style=\"color: #666; font-size: 14px;\">If you didn't request this reset, please ignore this email.</p><hr style=\"border: none; border-top: 1px solid #eee; margin: 20px 0;\"><p style=\"color: #999; font-size: 12px;\">This is an automated message from ClickAndCare system.</p></div>`
                });
                return { success: true, email: recoveryEmail.email };
            } catch (error) {
                console.error(`Failed to send email to ${recoveryEmail.email}:`, error);
                return { success: false, email: recoveryEmail.email, error: error.message };
            }
        });
        
        const results = await Promise.all(emailPromises);
        const successfulEmails = results.filter(r => r.success).map(r => r.email);
        const failedEmails = results.filter(r => !r.success).map(r => r.email);
        
        await logAdminAction('FORGOT_PASSWORD', `Password reset OTP sent to ${successfulEmails.length} recovery emails`, admin._id, admin.email, { successfulEmails, failedEmails, totalRecoveryEmails: activeRecoveryEmails.length }, req);
        
        res.json({ 
            success: true, 
            message: `OTP sent to ${successfulEmails.length} recovery email(s)`, 
            sentTo: successfulEmails, 
            failedTo: failedEmails,
            adminEmail: admin.email // Return the admin email for reference
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- RESET PASSWORD ---
const adminResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const admin = await Admin.findOne({ email, isActive: true });
        if (!admin) {
            return res.json({ success: false, message: "Admin account not found" });
        }
        if (!admin.resetOTP || !admin.resetOTP.code || !admin.resetOTP.expiresAt) {
            return res.json({ success: false, message: "No OTP request found" });
        }
        if (new Date() > admin.resetOTP.expiresAt) {
            return res.json({ success: false, message: "OTP has expired" });
        }
        if (admin.resetOTP.code !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        admin.password = hashedPassword;
        admin.resetOTP = undefined;
        await admin.save();
        await logAdminAction('RESET_PASSWORD', 'Admin password reset successfully', admin._id, admin.email, { email }, req);
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- GET ADMIN PROFILE ---
const getAdminProfile = async (req, res) => {
    try {
        let admin = null;
        if (req.adminId) {
            admin = await Admin.findById(req.adminId).select('-password -resetOTP');
        } else if (req.query.email) {
            admin = await Admin.findOne({ email: req.query.email }).select('-password -resetOTP');
        }
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        res.json({ success: true, admin });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// --- ADD RECOVERY EMAIL ---
const addRecoveryEmail = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (!password) {
            return res.json({ success: false, message: "Admin password is required" });
        }
        if (!name || !name.trim()) {
            return res.json({ success: false, message: "Name is required" });
        }
        
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.json({ success: false, message: "Admin account not found" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid admin password" });
        }
        
        const existingEmail = admin.recoveryEmails.find(re => re.email === email.toLowerCase());
        if (existingEmail) {
            return res.json({ success: false, message: "Recovery email already exists" });
        }
        
        admin.recoveryEmails.push({
            email: email.toLowerCase(),
            name: name.trim(),
            isActive: true
        });
        
        await admin.save();
        await logAdminAction('ADD_RECOVERY_EMAIL', `Added recovery email: ${email}`, admin._id, admin.email, { email, name }, req);
        res.json({ success: true, message: "Recovery email added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove recovery email
const removeRecoveryEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        
        // Find and remove the email
        const emailIndex = admin.recoveryEmails.findIndex(re => re.email === email.toLowerCase());
        if (emailIndex === -1) {
            return res.json({ success: false, message: "Recovery email not found" });
        }
        
        const removedEmail = admin.recoveryEmails[emailIndex];
        admin.recoveryEmails.splice(emailIndex, 1);
        await admin.save();
        
        // Log the action
        await logAdminAction(
            'REMOVE_RECOVERY_EMAIL',
            `Removed recovery email: ${email}`,
            admin._id,
            admin.email,
            { email },
            req
        );
        
        res.json({ success: true, message: "Recovery email removed successfully" });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Toggle recovery email status
const toggleRecoveryEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        
        // Find the email
        const recoveryEmail = admin.recoveryEmails.find(re => re.email === email.toLowerCase());
        if (!recoveryEmail) {
            return res.json({ success: false, message: "Recovery email not found" });
        }
        
        // Toggle status
        recoveryEmail.isActive = !recoveryEmail.isActive;
        await admin.save();
        
        // Log the action
        await logAdminAction(
            'TOGGLE_RECOVERY_EMAIL',
            `${recoveryEmail.isActive ? 'Activated' : 'Deactivated'} recovery email: ${email}`,
            admin._id,
            admin.email,
            { email, isActive: recoveryEmail.isActive },
            req
        );
        
        res.json({ 
            success: true, 
            message: `Recovery email ${recoveryEmail.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: recoveryEmail.isActive
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- CHANGE ADMIN EMAIL ---
const changeAdminEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body;
        
        if (!validator.isEmail(newEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        
        if (!password) {
            return res.json({ success: false, message: "Admin password is required" });
        }
        
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.json({ success: false, message: "Admin account not found" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid admin password" });
        }
        
        // Check if the new email is already in use by another admin
        const existingAdmin = await Admin.findOne({ email: newEmail.toLowerCase() });
        if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
            return res.json({ success: false, message: "Email is already in use by another admin" });
        }
        
        // Check if the new email is already a recovery email
        const isRecoveryEmail = admin.recoveryEmails.some(re => re.email === newEmail.toLowerCase());
        if (isRecoveryEmail) {
            return res.json({ success: false, message: "Cannot use a recovery email as the main admin email" });
        }
        
        const oldEmail = admin.email;
        admin.email = newEmail.toLowerCase();
        await admin.save();
        
        await logAdminAction('CHANGE_ADMIN_EMAIL', `Changed admin email from ${oldEmail} to ${newEmail}`, admin._id, admin.email, { oldEmail, newEmail }, req);
        
        res.json({ 
            success: true, 
            message: "Admin email changed successfully",
            newEmail: admin.email
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addDoctor, loginAdmin , allDoctors, appointmentsAdmin , appointmentCancel , adminDashboard, approveDoctor, getPendingDoctors, approveExistingDoctors, deleteDoctor, getAdminLogs, adminForgotPassword, adminResetPassword, getAdminProfile, addRecoveryEmail, removeRecoveryEmail, toggleRecoveryEmail, changeAdminEmail }; 
