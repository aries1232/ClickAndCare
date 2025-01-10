//API for adding doctor
import doctorModel from './../models/doctorModel.js';
import validator from 'validator'
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const addDoctor =async(req,res)=>{
    try {
        
        const {name,email,password,speciality,degree,experience,about, fees, address } = req.body
        const imageFile=req.file 

        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({sucess:false, message:"Missing Details"})
        }
        
        //validating strong password
        if(!validator.isEmail(email)){
            return res.json({sucess:false,message:"Please enter a valid email"})
        }
        
        //hashing doctor password
        if(password.length<8){
            return res.json({sucess:false,message:"Please enter a strong password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resouce_type:"image"})
        const imageURL =imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image:imageURL,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            experience,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({sucess:true, message:"Doctor Added"})

        
    } catch (error) {

        console.log(error)
        res.json({sucess:false,message:error.message})
    }
}

const loginAdmin =async(req,res) =>{
    try {

        const {email,password} = req.body

        if(email=== process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({sucess:true,token})
        }
         
    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error.message})
    }
}

export  {addDoctor,loginAdmin}