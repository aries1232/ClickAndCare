import express from 'express'
import {allDoctors,loginAdmin, appointmentsAdmin , appointmentCancel , adminDashboard, approveDoctor, getPendingDoctors, approveExistingDoctors, addDoctor, deleteDoctor, getAdminLogs, adminForgotPassword, adminResetPassword, getAdminProfile, addRecoveryEmail, removeRecoveryEmail, toggleRecoveryEmail, changeAdminEmail, updateDoctorInfo, updateDoctorProfilePicture, toggleDoctorVisibility} from '../controllers/adminController.js'
import {changeAvailability} from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'

 

const adminRouter =express.Router()

// Authentication routes
adminRouter.post('/login',loginAdmin)
adminRouter.post('/forgot-password', adminForgotPassword)
adminRouter.post('/reset-password', adminResetPassword)

// Protected routes
adminRouter.get('/dashboard',adminAuth,adminDashboard);
adminRouter.post('/all-doctors',adminAuth,allDoctors)
adminRouter.post('/change-availablity',adminAuth,changeAvailability);
adminRouter.get('/appointments',adminAuth,appointmentsAdmin);
adminRouter.post('/cancel-appointment',adminAuth,appointmentCancel);
adminRouter.post('/approve-doctor',adminAuth,approveDoctor);
adminRouter.get('/pending-doctors',adminAuth,getPendingDoctors);
adminRouter.post('/approve-existing-doctors',adminAuth,approveExistingDoctors);
adminRouter.post('/add-doctor',adminAuth,upload.single('image'),addDoctor);
adminRouter.put('/update-doctor-info',adminAuth,updateDoctorInfo);
adminRouter.put('/update-doctor-picture',adminAuth,upload.single('image'),updateDoctorProfilePicture);
adminRouter.post('/toggle-doctor-visibility',adminAuth,toggleDoctorVisibility);
adminRouter.delete('/delete-doctor/:doctorId',adminAuth,deleteDoctor);
adminRouter.get('/logs',adminAuth,getAdminLogs);

// Admin profile and recovery email management
adminRouter.get('/profile', adminAuth, getAdminProfile)
adminRouter.put('/change-email', adminAuth, changeAdminEmail)
adminRouter.post('/recovery-email', adminAuth, addRecoveryEmail)
adminRouter.delete('/recovery-email/:email', adminAuth, removeRecoveryEmail)
adminRouter.patch('/recovery-email/:email/toggle', adminAuth, toggleRecoveryEmail)

export default adminRouter 