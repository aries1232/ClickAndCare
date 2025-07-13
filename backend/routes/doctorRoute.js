import express from 'express'; 
import { appointmentsDoctor, getDoctors, loginDoctor, appointmentCancel,appointmentComplete, doctorDashboard,doctorProfile,updateDoctorProfile, signupDoctor, updateProfilePicture, sendSignupOTP, verifySignupOTP, getAppointmentChatMessages, getUnreadCounts} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';

const doctorRouter = express.Router();

// OTP verification routes
doctorRouter.post('/send-signup-otp', sendSignupOTP);
doctorRouter.post('/verify-signup-otp', verifySignupOTP);

doctorRouter.post('/signup', upload.single('image'), signupDoctor);
doctorRouter.post('/get-doctors',getDoctors);
doctorRouter.post('/login',loginDoctor);
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