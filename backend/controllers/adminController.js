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

//api for the getting all doctors (for admin panel - all doctors including those without profile pictures)
const allDoctors = async(req,res) => {
        try {
            const doctors = await doctorModel.find({}).select('-password');
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
                recoveryEmails: {
                    $elemMatch: {
                        email: email.toLowerCase(),
                        isActive: true
                    }
                },
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
        
        // Get device and location information
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'Unknown';
        const loginTime = new Date().toLocaleString();
        
        // Extract device information from user agent
        let deviceInfo = 'Unknown Device';
        let browserInfo = 'Unknown Browser';
        
        if (userAgent.includes('Mobile')) {
            deviceInfo = 'Mobile Device';
        } else if (userAgent.includes('Tablet')) {
            deviceInfo = 'Tablet';
        } else if (userAgent.includes('Windows')) {
            deviceInfo = 'Windows Computer';
        } else if (userAgent.includes('Mac')) {
            deviceInfo = 'Mac Computer';
        } else if (userAgent.includes('Linux')) {
            deviceInfo = 'Linux Computer';
        }
        
        if (userAgent.includes('Chrome')) {
            browserInfo = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            browserInfo = 'Firefox';
        } else if (userAgent.includes('Safari')) {
            browserInfo = 'Safari';
        } else if (userAgent.includes('Edge')) {
            browserInfo = 'Edge';
        }
        
        // Log which email was used for login
        const loginEmailType = email.toLowerCase() === admin.email.toLowerCase() ? 'admin_email' : 'recovery_email';
        await logAdminAction('LOGIN', LOG_MESSAGES.LOGIN, admin._id, admin.email, { 
            loginEmail: email, 
            loginEmailType,
            adminEmail: admin.email,
            deviceInfo,
            browserInfo,
            ipAddress
        }, req);
        
        // Send email notifications to all recovery emails and admin email
        try {
            const subject = 'Admin Login Alert - ClickAndCare';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
                    <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="background-color: #007bff; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <h1 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">Admin Login Alert</h1>
                            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">New login detected for ClickAndCare admin account</p>
                        </div>
                        
                        <div style="color: #555; line-height: 1.6;">
                            <div style="background-color: #e3f2fd; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">Login Details:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">A new login has been detected for the ClickAndCare admin account.</p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">Login Time:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">${loginTime}</p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">Login Email Used:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">${email}</p>
                                <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
                                    ${email.toLowerCase() === admin.email.toLowerCase() ? 'Admin Email' : 'Recovery Email'}
                                </p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">Device Information:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">${deviceInfo} - ${browserInfo}</p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">IP Address:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">${ipAddress}</p>
                            </div>
                            
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #856404; font-weight: 600;">
                                    ⚠️ Security Notice: If this login was not authorized by you, please contact the system administrator immediately and change your password.
                                </p>
                            </div>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                <p style="margin: 0; font-size: 14px; color: #999; text-align: center;">
                                    This is an automated security notification from ClickAndCare system.<br>
                                    For security reasons, we notify all authorized contacts of admin login activities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Send to admin email
            await sendEmail({
                to: admin.email,
                subject: subject,
                html: html
            });
            
            // Send to all active recovery emails
            const activeRecoveryEmails = admin.recoveryEmails.filter(email => email.isActive);
            const emailPromises = activeRecoveryEmails.map(async (recoveryEmail) => {
                try {
                    await sendEmail({
                        to: recoveryEmail.email,
                        subject: subject,
                        html: html
                    });
                    return { success: true, email: recoveryEmail.email };
                } catch (error) {
                    console.error(`Failed to send login alert to ${recoveryEmail.email}:`, error);
                    return { success: false, email: recoveryEmail.email, error: error.message };
                }
            });
            
            const results = await Promise.all(emailPromises);
            const successfulEmails = results.filter(r => r.success).map(r => r.email);
            const failedEmails = results.filter(r => !r.success).map(r => r.email);
            
            console.log(`Login alert sent to admin email and ${successfulEmails.length} recovery emails. Failed: ${failedEmails.length}`);
            
        } catch (emailError) {
            console.error('Failed to send login alert emails:', emailError);
            // Don't fail the login if email fails
        }
        
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
                recoveryEmails: {
                    $elemMatch: {
                        email: email.toLowerCase(),
                        isActive: true
                    }
                },
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
        
        console.log('Toggle recovery email request:', { email, adminId: req.adminId });
        
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        
        console.log('Admin found:', { adminEmail: admin.email, recoveryEmails: admin.recoveryEmails });
        
        // Decode the email parameter and convert to lowercase
        const decodedEmail = decodeURIComponent(email).toLowerCase();
        console.log('Looking for email:', decodedEmail);
        
        // Find the email
        const recoveryEmail = admin.recoveryEmails.find(re => re.email === decodedEmail);
        if (!recoveryEmail) {
            console.log('Recovery email not found. Available emails:', admin.recoveryEmails.map(re => re.email));
            return res.json({ success: false, message: "Recovery email not found" });
        }
        
        console.log('Recovery email found:', { email: recoveryEmail.email, currentStatus: recoveryEmail.isActive });
        
        // Toggle status
        const wasActive = recoveryEmail.isActive;
        recoveryEmail.isActive = !recoveryEmail.isActive;
        await admin.save();
        
        console.log('Status toggled to:', recoveryEmail.isActive);
        
        // Send email notification
        try {
            const action = recoveryEmail.isActive ? 'activated' : 'deactivated';
            const subject = `Recovery Email ${action.charAt(0).toUpperCase() + action.slice(1)} - ClickAndCare`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
                    <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="background-color: #17de71; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <h1 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">Recovery Email ${action.charAt(0).toUpperCase() + action.slice(1)}</h1>
                        </div>
                        
                        <div style="color: #555; line-height: 1.6;">
                            <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${recoveryEmail.name}</strong>,</p>
                            
                            <p style="font-size: 16px; margin-bottom: 20px;">
                                Your recovery email has been <strong style="color: ${recoveryEmail.isActive ? '#17de71' : '#ff6b6b'}; font-weight: 600;">${action}</strong> for the ClickAndCare system.
                            </p>
                            
                            <div style="background-color: #f8f9fa; border-left: 4px solid ${recoveryEmail.isActive ? '#17de71' : '#ff6b6b'}; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">Recovery Email:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">${recoveryEmail.email}</p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                                <p style="margin: 0; font-weight: 600; color: #333;">Current Status:</p>
                                <p style="margin: 5px 0 0 0; color: #666;">
                                    <span style="color: ${recoveryEmail.isActive ? '#17de71' : '#ff6b6b'}; font-weight: 600;">
                                        ${recoveryEmail.isActive ? '✓ Active' : '✗ Inactive'}
                                    </span>
                                </p>
                            </div>
                            
                            ${recoveryEmail.isActive ? 
                                `<div style="background-color: #e8f5e8; border: 1px solid #17de71; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                    <p style="margin: 0; color: #17de71; font-weight: 600;">
                                        ✓ You will now receive OTP codes for password reset requests
                                    </p>
                                </div>` : 
                                `<div style="background-color: #ffe8e8; border: 1px solid #ff6b6b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                    <p style="margin: 0; color: #ff6b6b; font-weight: 600;">
                                        ✗ You will no longer receive OTP codes for password reset requests
                                    </p>
                                </div>`
                            }
                            
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 14px; color: #666;">
                                    <strong>Action Time:</strong> ${new Date().toLocaleString()}
                                </p>
                            </div>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                <p style="margin: 0; font-size: 14px; color: #999; text-align: center;">
                                    This is an automated security notification from ClickAndCare system.<br>
                                    If you didn't expect this change, please contact the system administrator immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            await sendEmail({
                to: recoveryEmail.email,
                subject: subject,
                html: html
            });
            
            console.log(`Email notification sent to ${recoveryEmail.email} for ${action} action`);
        } catch (emailError) {
            console.error(`Failed to send email notification to ${recoveryEmail.email}:`, emailError);
            // Don't fail the entire operation if email fails
        }
        
        // Log the action
        await logAdminAction(
            'TOGGLE_RECOVERY_EMAIL',
            `${recoveryEmail.isActive ? 'Activated' : 'Deactivated'} recovery email: ${decodedEmail}`,
            admin._id,
            admin.email,
            { email: decodedEmail, isActive: recoveryEmail.isActive, wasActive },
            req
        );
        
        res.json({ 
            success: true, 
            message: `Recovery email ${recoveryEmail.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: recoveryEmail.isActive
        });
        
    } catch (error) {
        console.log('Error in toggleRecoveryEmail:', error);
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

// Admin function to update doctor information
const updateDoctorInfo = async (req, res) => {
    try {
        const { doctorId, name, speciality, degree, experience, about, fees, address } = req.body;
        const adminId = req.adminId;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (speciality) updateData.speciality = speciality;
        if (degree) updateData.degree = degree;
        if (experience) updateData.experience = experience;
        if (about) updateData.about = about;
        if (fees) updateData.fees = fees;
        if (address) {
            // Parse address if it's a string
            try {
                updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
            } catch (error) {
                return res.json({ success: false, message: "Invalid address format" });
            }
        }

        // Update doctor
        await doctorModel.findByIdAndUpdate(doctorId, updateData);

        // Log the action
        await logAdminAction(
            'UPDATE_DOCTOR',
            `Updated doctor information: ${doctor.name}`,
            adminId,
            doctor.email,
            { doctorId, updatedFields: Object.keys(updateData) },
            req
        );

        res.json({ success: true, message: "Doctor information updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin function to update doctor profile picture
const updateDoctorProfilePicture = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const imageFile = req.file;
        const adminId = req.adminId;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }

        if (!imageFile) {
            return res.json({ success: false, message: "No image provided" });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

        // Update doctor's profile picture
        await doctorModel.findByIdAndUpdate(doctorId, { image: imageURL });

        // Log the action
        await logAdminAction(
            'UPDATE_DOCTOR_PICTURE',
            `Updated profile picture for doctor: ${doctor.name}`,
            adminId,
            doctor.email,
            { doctorId, imageURL },
            req
        );

        res.json({ success: true, message: "Profile picture updated successfully", image: imageURL });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin function to toggle doctor visibility on user website
const toggleDoctorVisibility = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const adminId = req.adminId;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Toggle visibility
        const newVisibility = !doctor.visible;
        await doctorModel.findByIdAndUpdate(doctorId, { visible: newVisibility });

        // Log the action
        await logAdminAction(
            'TOGGLE_DOCTOR_VISIBILITY',
            `${newVisibility ? 'Made visible' : 'Hidden'} doctor: ${doctor.name}`,
            adminId,
            doctor.email,
            { doctorId, visible: newVisibility },
            req
        );

        res.json({ 
            success: true, 
            message: `Doctor ${newVisibility ? 'made visible' : 'hidden'} successfully`,
            visible: newVisibility
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addDoctor, loginAdmin , allDoctors, appointmentsAdmin , appointmentCancel , adminDashboard, approveDoctor, getPendingDoctors, approveExistingDoctors, deleteDoctor, getAdminLogs, adminForgotPassword, adminResetPassword, getAdminProfile, addRecoveryEmail, removeRecoveryEmail, toggleRecoveryEmail, changeAdminEmail, updateDoctorInfo, updateDoctorProfilePicture, toggleDoctorVisibility }; 
