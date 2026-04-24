import express from 'express'; 
import { appointmentsDoctor, getDoctors, loginDoctor, appointmentCancel,appointmentComplete, doctorDashboard,doctorProfile,updateDoctorProfile, signupDoctor, updateProfilePicture, sendSignupOTP, verifySignupOTP, getAppointmentChatMessages, getUnreadCounts, getBookedSlots} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';
import { validate } from '../middlewares/validate.js';

const doctorRouter = express.Router();

// OTP verification routes
doctorRouter.post('/send-signup-otp', validate({ email: 'email' }), sendSignupOTP);
doctorRouter.post('/verify-signup-otp', validate({ email: 'email', otp: 'otp' }), verifySignupOTP);

doctorRouter.post('/signup', upload.single('image'), signupDoctor);
doctorRouter.post('/get-doctors', getDoctors);
doctorRouter.get('/booked-slots/:docId', getBookedSlots);
doctorRouter.post('/login', validate({ email: 'email', password: 'nonEmpty' }), loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor,appointmentCancel)
doctorRouter.get('/dashboard', authDoctor,doctorDashboard)
doctorRouter.get('/profile', authDoctor,doctorProfile)
doctorRouter.post('/update-profile', authDoctor,updateDoctorProfile)
doctorRouter.post('/update-profile-picture', authDoctor, upload.single('image'), updateProfilePicture)
doctorRouter.get('/appointment/:appointmentId/chat-messages', authDoctor, getAppointmentChatMessages)
doctorRouter.get('/unread-counts', authDoctor, getUnreadCounts)

export default doctorRouter;