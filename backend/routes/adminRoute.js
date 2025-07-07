import express from 'express'
import {allDoctors,loginAdmin, appointmentsAdmin , appointmentCancel , adminDashboard, approveDoctor, getPendingDoctors, approveExistingDoctors, addDoctor, deleteDoctor, getAdminLogs} from '../controllers/adminController.js'
import {changeAvailability} from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'

 

const adminRouter =express.Router()
adminRouter.get('/dashboard',adminAuth,adminDashboard);
adminRouter.post('/all-doctors',adminAuth,allDoctors)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/change-availablity',adminAuth,changeAvailability);
adminRouter.get('/appointments',adminAuth,appointmentsAdmin);
adminRouter.post('/cancel-appointment',adminAuth,appointmentCancel);
adminRouter.post('/approve-doctor',adminAuth,approveDoctor);
adminRouter.get('/pending-doctors',adminAuth,getPendingDoctors);
adminRouter.post('/approve-existing-doctors',adminAuth,approveExistingDoctors);
adminRouter.post('/add-doctor',adminAuth,upload.single('image'),addDoctor);
adminRouter.delete('/delete-doctor/:doctorId',adminAuth,deleteDoctor);
adminRouter.get('/logs',adminAuth,getAdminLogs);


export default adminRouter 