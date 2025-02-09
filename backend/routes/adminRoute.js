import express from 'express'
import {addDoctor,allDoctors,loginAdmin, appointmentsAdmin , appointmentCancel , adminDashboard} from '../controllers/adminController.js'
import {changeAvailability} from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'

 

const adminRouter =express.Router()
adminRouter.get('/dashboard',adminAuth,adminDashboard);
adminRouter.post('/add-doctor',adminAuth, upload.single('image'), addDoctor)
adminRouter.post('/all-doctors',adminAuth,allDoctors)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/change-availablity',adminAuth,changeAvailability);
adminRouter.get('/appointments',adminAuth,appointmentsAdmin);
adminRouter.post('/cancel-appointment',adminAuth,appointmentCancel);


export default adminRouter 