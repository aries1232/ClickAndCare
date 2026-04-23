import express from 'express';
import { getChatDebug, clearAllChatData } from '../controllers/debugController.js';

const debugRouter = express.Router();

debugRouter.get('/chat/:appointmentId', getChatDebug);
debugRouter.delete('/clear-chat-data', clearAllChatData);

export default debugRouter;
