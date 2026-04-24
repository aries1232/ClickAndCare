import express from 'express'
import {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  bookAppointment,
  allAppointments,
  cancelAppointment,
  makePayment,
  verifyPayment,
  releaseLock,
  forgotPassword,
  resetPassword,
  getAppointmentChatMessages,
  getUnreadCounts,
  resetAllUnreadCounts,
  googleLogin
} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import { validate } from '../middlewares/validate.js'

const userRouter = express.Router()

// Auth
userRouter.post('/register', validate({ name: 'nonEmpty', email: 'email', password: 'password' }), registerUser)
userRouter.post('/verify-otp', validate({ userId: 'nonEmpty', otp: 'otp' }), verifyOTP)
userRouter.post('/resend-otp', resendOTP)
userRouter.post('/login', validate({ email: 'email', password: 'nonEmpty' }), loginUser)
userRouter.post('/google-login', googleLogin)
userRouter.post('/forgot-password', validate({ email: 'email' }), forgotPassword)
userRouter.post('/reset-password', validate({ userId: 'nonEmpty', otp: 'otp', newPassword: 'password' }), resetPassword)

// Profile
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)

// Appointments
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, allAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/make-payment', authUser, makePayment)
userRouter.get('/verify-payment', authUser, verifyPayment)
userRouter.post('/release-lock', authUser, releaseLock)

// Chat
userRouter.get('/appointment/:appointmentId/chat-messages', authUser, getAppointmentChatMessages)
userRouter.get('/unread-counts', authUser, getUnreadCounts)

// Dev-only bulk reset (scorched-earth). Not mounted in production.
if (process.env.NODE_ENV !== 'production') {
  userRouter.post('/reset-unread-counts', authUser, resetAllUnreadCounts)
}

export default userRouter
