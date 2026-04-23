import express from 'express';
import upload from '../middlewares/multer.js';
import { uploadChatImage } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.post('/upload-image', upload.single('image'), uploadChatImage);

export default chatRouter;
