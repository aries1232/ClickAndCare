import express from 'express'
import {addDoctor,allDoctors,loginAdmin} from '../controllers/adminController.js'
import {changeAvailability} from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'

 

const adminRouter =express.Router()

adminRouter.post('/add-doctor',adminAuth, upload.single('image'), addDoctor)
adminRouter.post('/all-doctors',adminAuth,allDoctors)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/change-availablity',adminAuth,changeAvailability);


export default adminRouter 