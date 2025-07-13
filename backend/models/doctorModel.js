import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    image: {type:String, default:null},
    speciality: {type:String, required:true},
    degree: {type:String, required:true},
    experience: {type:String, required:true},
    about: {type:String, required:true},
    available: {type:Boolean, default:true},
    approved: {type:Boolean, default:false},
    visible: {type:Boolean, default:true}, // Whether doctor is visible on user website
    fees: {type:Number, required:true},
    address: {type:Object, required:true},
    date: {type:Number, required:true},
    slots_booked: {type:Object, default:{}},
    // OTP verification fields
    emailVerified: {type:Boolean, default:false},
    otp: {type:String, default:null},
    otpExpiry: {type:Date, default:null},
},{minimize:false})

const doctorModel = mongoose.models.doctor || mongoose.model('doctor',doctorSchema);


export default doctorModel;