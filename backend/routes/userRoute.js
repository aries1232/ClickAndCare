import express from 'express'
import { registerUser, loginUser, verifyOTP, resendOTP, getProfile, updateProfile, bookAppointment, allAppointments, cancelAppointment, makePayment, updatePaymentStatus, forgotPassword, resetPassword, getAppointmentChatMessages, getUnreadCounts, resetAllUnreadCounts } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
// import MyProfile from '../../frontend/src/Pages/MyProfile.jsx'


const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/resend-otp', resendOTP)
userRouter.post('/login', loginUser)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/get-profile', authUser, getProfile)
// userRouter.get('/my-profile', authUser, MyProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, allAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/make-payment', authUser, makePayment)
userRouter.post('/update-payment-status', authUser, updatePaymentStatus)
userRouter.get('/appointment/:appointmentId/chat-messages', authUser, getAppointmentChatMessages)
userRouter.get('/unread-counts', authUser, getUnreadCounts)
userRouter.post('/reset-unread-counts', authUser, resetAllUnreadCounts)

export default userRouter