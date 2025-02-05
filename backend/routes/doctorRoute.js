import express from 'express'; 
import { getDoctors} from '../controllers/doctorController.js';

const doctorRouter = express.Router();

doctorRouter.post('/get-doctors',getDoctors);
export default doctorRouter;