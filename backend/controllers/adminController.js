import doctorModel from './../models/doctorModel.js';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import AdminLog from '../models/adminLogModel.js';
import { logAdminAction, LOG_MESSAGES } from '../utils/adminLogger.js';


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

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if(email != process.env.ADMIN_EMAIL || password != process.env.ADMIN_PASSWORD) {
        res.json({ success: false, message: "wrong credentials!"});
    }
    try {
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            
            // Log admin login
            await logAdminAction('LOGIN', LOG_MESSAGES.LOGIN, null, null, { email }, req);
            
            res.json({ success: true, token });
            // console.log(token);
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message , message: "chud gye guru"});
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

export { addDoctor, loginAdmin , allDoctors, appointmentsAdmin , appointmentCancel , adminDashboard, approveDoctor, getPendingDoctors, approveExistingDoctors, deleteDoctor, getAdminLogs }; 
