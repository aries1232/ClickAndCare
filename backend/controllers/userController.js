import validator from 'validator'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
//API to register user
const registerUser=async(req,res)=>{
    try {
        const{name ,email ,password}= req.body
      if(!name || !password || !email){
        return res.json({success:false,message:"Missing Details"})
      }
      if(!validator.isEmail(email)){
        return res.json({success:false ,message:"enter a valid email"})
      }
        
      if(password.length<8){
        return res.json({success:false ,message:"enter a strong password"})
      }
     
      const salt = await bcrypt.genSalt(10)
      const hashedPassword =await bcrypt.hash(password,salt)

      const userData={
        name,
        email,
        password: hashedPassword
      }

      const newUser =new userModel(userData)
      const user =await newUser.save()

      const token =jwt.sign({id:user._id},process.env.JWT_SECRET)
      res.json({success:true,token})
 
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email)
        {
          return res.json({success:false ,message:"Enter Your Email Please"})
        }
        if(!validator.isEmail(email)){
          return res.json({success:false ,message:"Enter a valid email"})
        }
          
        if(password.length<8){
          return res.json({success:false ,message:"Password is Too Small"})
        }
        const user =await userModel.findOne({email})
         
        if(!user){
           return res.json({success: false,message:'User does not exist'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token =jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
            console.log("login occured")
        }
        else{
            res.json({success:false,message:"Invalid Credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//APi to get User profile data

const getProfile =async(req,res)=>{
  try {
    const { userId}=req.body
    const userData= await userModel.findById(userId).select('-password')
    res.json({success:true,userData})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//api to update user info

const updateProfile=async(req,res)=>{
  try {
    const {userId,name,phone,address,dob,gender}=req.body
    const imageFile=req.file
    if(!name|| !phone || !address || !dob ||!gender )
    {
      return res.json({success:false,message:"Data Missing"})
    }

    await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
    if(imageFile){
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
        const imageURL=imageUpload.secure_url

        await userModel.findByIdAndUpdate(userId,{image:imageURL})
    }
    res.json({success:true,message:"Profile Updated"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
//Api to book appointment
const bookAppointment=async(req,res)=>{
  try {
    const {userId,docId,slotDate,slotTime}=req.body
    const docData= await doctorModel.findById(docId).select('-password')
    if(!docData.available){
      return res.json({success:false,message:"Doctor Not Available"})
    }
  let slots_booked=docData.slots_booked
  if(slots_booked[slotDate]){
    if(slots_booked[slotDate].includes(slotTime)){
      return res.json({success:false,message:"Slot Not Available"})
    }
    else{
      slots_booked[slotDate].push(slotTime)
    }

    
  }else{
    slots_booked[slotDate]=[]
    slots_booked[slotDate].push(slotTime)
  }
   const userData= await userModel.findById(userId).select('-password')
   delete docData.slots_booked
   const appointmentData={
     userId,
     docId,
     slotDate,
     slotTime,
     userData,
     docData,
     amount:docData.fees,
     date:Date.now()
   }
   const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()
    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:"Appointment Booked"})


  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//api to get appointments for the user
const allAppointments= async(req,res)=>{
  
  try {
    const {userId} = req.body;
    const data = await appointmentModel.find({userId});
    //console.log(data);
    res.json({success:true,data});
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    
  }

}

//api to cancel user appointment

const cancelAppointment=async(req,res)=>{
  try {

    const {userId, appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if(appointmentData.userId!==userId){
      return res.json({sucess:false,message:"Unauthorized action"})
    }

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



// api to make payment 

const makePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body; 

 
    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ success: false, message: "Invalid appointmentId format" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Appointment with ${appointmentData.docData.name}`,
            },
            unit_amount: appointmentData.amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url:  `http://localhost:5173/success/${appointmentId}`,
      cancel_url: 'http://localhost:5173/cancel',
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
      return res.status(400).json({ success: false, message: "Invalid appointmentId format" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
    res.json({ success: true, message: "Payment status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export {registerUser,loginUser,getProfile,updateProfile ,bookAppointment , allAppointments, cancelAppointment,makePayment , updatePaymentStatus};