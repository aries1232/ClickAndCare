import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


//api for doctor login in the admin panel

const loginDoctor = async(req,res) => {
  try {

    const {email,password} = req.body
    const doctor  = await doctorModel.findOne({email});

    if(!doctor) {
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

    res.json({ success: true, message: "Availability Updated", doctor: updatedDoctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all doctors (for admin panel)
const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password -email']);  

        res.json({ success: true, doctors}); 
    } catch (error) {
        console.error(error.message);  
        res.status(500).json({ success: false, message: error.message }); 
    }
};

// get all appointments for a particular doctor 

const appointmentsDoctor = async(req,res) => {
  try {
    const {docId} = req.body

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

    const {docId, appointmentId} = req.body;

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

    const {docId, appointmentId} = req.body;

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

    const {docId} = req.body;

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

    const {docId} =req.body;

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

    const {docId, fees, address, available,about} = req.body;

    await doctorModel.findByIdAndUpdate(docId,{fees,address,available,about});

    res.json({success:true,message:"Profile Updated"})
    
  } catch (error) {

    console.error(error.message);
    res.json({success:false,message:error.message})
    
  }
}


export { changeAvailability ,getDoctors , loginDoctor , appointmentsDoctor, appointmentCancel, appointmentComplete,doctorDashboard, updateDoctorProfile, doctorProfile};
