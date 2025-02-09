import express from 'express'; 
import { appointmentsDoctor, getDoctors, loginDoctor, appointmentCancel,appointmentComplete, doctorDashboard} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post('/get-doctors',getDoctors);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor,appointmentCancel)
doctorRouter.get('/dashboard', authDoctor,doctorDashboard)

export default doctorRouter;