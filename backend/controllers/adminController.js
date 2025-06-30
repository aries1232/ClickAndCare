import doctorModel from './../models/doctorModel.js';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


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

//api for the getting all doctors
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

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if(email != process.env.ADMIN_EMAIL || password != process.env.ADMIN_PASSWORD) {
        res.json({ success: false, message: "wrong credentials!"});
    }
    try {
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
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
        const users = await userModel.find({});
        const appointment = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
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



export { addDoctor, loginAdmin , allDoctors, appointmentsAdmin , appointmentCancel , adminDashboard }; 
