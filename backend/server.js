import express from "express";
import cors from "cors";
import "dotenv/config";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from "./config/mongodb.js";
import connectCloudinary from './config/cloudinary.js';
import { v2 as cloudinary } from "cloudinary";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import appointmentModel from './models/appointmentModel.js';
import jwt from 'jsonwebtoken';
import upload from './middlewares/multer.js';



// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//app config
const app = express();
const port = process.env.PORT || 3000;
connectDB()
connectCloudinary()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//middlewares
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
      'https://clickandcare-frontend.onrender.com',
      'https://clickandcare-admin.onrender.com'
    ];
    
    // In development, allow any localhost origin
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dToken', 'dtoken', 'DToken', 'DToken']
};

app.use(cors(corsOptions));

// API routes
app.use('/api/admin',adminRouter)  //localhost:3000/api/admin/add-doctor
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "API Working", timestamp: new Date().toISOString() });
});





// Debug endpoint to check conversations and messages
app.get("/api/debug/chat/:appointmentId", async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const conversation = await Conversation.findOne({ appointmentId })
            .populate('messages');
        
        res.json({
            appointmentId,
            conversation: conversation ? {
                _id: conversation._id,
                participants: conversation.participants,
                participantsModel: conversation.participantsModel,
                messageCount: conversation.messages?.length || 0,
                messages: conversation.messages?.map(msg => ({
                    _id: msg._id,
                    senderId: msg.senderId,
                    senderModel: msg.senderModel,
                    message: msg.message,
                    createdAt: msg.createdAt
                })) || []
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Temporary endpoint to clear all chat data
app.delete("/api/debug/clear-chat-data", async (req, res) => {
    try {
        // Delete all conversations
        const conversationResult = await Conversation.deleteMany({});
        console.log(`Deleted ${conversationResult.deletedCount} conversations`);

        // Delete all messages
        const messageResult = await Message.deleteMany({});
        console.log(`Deleted ${messageResult.deletedCount} messages`);

        res.json({ 
            success: true, 
            message: 'All chat data cleared successfully!',
            deletedConversations: conversationResult.deletedCount,
            deletedMessages: messageResult.deletedCount
        });
    } catch (error) {
        console.error('Error clearing chat data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Image upload endpoint for chat
app.post("/api/chat/upload-image", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed.' });
        }

        // Validate file size (5MB max)
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: 'File size must be less than 5MB' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "chat-images"
        });

        res.json({
            success: true,
            fileUrl: result.secure_url,
            fileName: req.file.originalname,
            fileSize: req.file.size
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Failed to upload image' });
    }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend build
  app.use(express.static(join(__dirname, '../frontend/dist')));
  
  // Serve admin build
  app.use('/admin', express.static(join(__dirname, '../admin/dist')));
  
  // Handle frontend routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/admin')) {
      res.sendFile(join(__dirname, '../admin/dist/index.html'));
    } else {
      res.sendFile(join(__dirname, '../frontend/dist/index.html'));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Working - Development Mode");
  });
}

// Create HTTP server and wrap Express app
const server = http.createServer(app);

// Initialize socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
      'https://clickandcare-frontend.onrender.com',
      'https://clickandcare-admin.onrender.com'
    ],
    credentials: true
  }
});

// Socket.io logic for real-time chat
io.on('connection', (socket) => {
  // Join appointment room
  socket.on('joinAppointmentRoom', (appointmentId) => {
    socket.join(appointmentId);
  });

  // Handle sending a message
  socket.on('sendMessage', async (data) => {
    try {
      const { appointmentId, message } = data;
      console.log('Socket: Processing message for appointment:', appointmentId);
      
      // Find or create conversation for this appointment
      let conversation = await Conversation.findOne({ appointmentId });
      
      if (!conversation) {
        // Get appointment details
        const appointment = await appointmentModel.findById(appointmentId);
        
        if (!appointment) {
          console.error('Socket: Appointment not found:', appointmentId);
          return;
        }

        // Create new conversation
        conversation = new Conversation({
          appointmentId,
          participants: [appointment.userId, appointment.docId],
          participantsModel: ['user', 'doctor'],
          messages: [],
          unreadCount: new Map(),
        });
        await conversation.save();
        console.log('Socket: Created new conversation:', conversation._id);
      }

      // Create new message
      const newMessage = new Message({
        senderId: message.sender,
        senderModel: conversation.participants[0] === message.sender ? 'user' : 'doctor',
        receiverId: conversation.participants[0] === message.sender ? conversation.participants[1] : conversation.participants[0],
        receiverModel: conversation.participants[0] === message.sender ? 'doctor' : 'user',
        message: message.message,
        messageType: message.messageType || 'text',
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileSize: message.fileSize,
        status: 'sent',
      });
      
      await newMessage.save();
      console.log('Socket: Saved message:', newMessage._id);

      // Add message to conversation
      conversation.messages.push(newMessage._id);
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageTime = new Date();
      await conversation.save();

      // Update unread count for the receiver (only if message is from the other participant)
      const receiverId = newMessage.receiverId;
      const senderId = newMessage.senderId;
      
      console.log('Socket: Message from', senderId, 'to', receiverId);
      
      // Only increment unread count if the sender is different from the receiver
      if (senderId.toString() !== receiverId.toString()) {
        if (!conversation.unreadCount.has(receiverId.toString())) {
          conversation.unreadCount.set(receiverId.toString(), 0);
        }
        const currentCount = conversation.unreadCount.get(receiverId.toString());
        conversation.unreadCount.set(receiverId.toString(), currentCount + 1);
        await conversation.save();
        console.log('Socket: Incremented unread count for', receiverId, 'from', currentCount, 'to', currentCount + 1);
        
        // Emit unread count update to all participants
        const unreadCounts = {};
        for (const [participantId, count] of conversation.unreadCount.entries()) {
          unreadCounts[participantId] = count;
        }
        
        io.to(appointmentId).emit('unreadCountUpdate', {
          appointmentId,
          unreadCounts
        });
        
        console.log('Socket: Emitted unread count update after new message:', unreadCounts);
      } else {
        console.log('Socket: Skipping unread count update (sender = receiver)');
      }

      // Broadcast message to all users in the appointment room
      const broadcastMessage = {
        _id: newMessage._id,
        sender: newMessage.senderId,
        message: newMessage.message,
        messageType: newMessage.messageType,
        fileUrl: newMessage.fileUrl,
        fileName: newMessage.fileName,
        fileSize: newMessage.fileSize,
        status: newMessage.status,
        deliveredAt: newMessage.deliveredAt,
        readAt: newMessage.readAt,
        time: new Date(newMessage.createdAt).toLocaleTimeString(),
        createdAt: newMessage.createdAt,
        appointmentId: appointmentId, // Add appointmentId to the message
      };
      
      io.to(appointmentId).emit('receiveMessage', broadcastMessage);
      
      // Note: Unread count is now handled entirely on the frontend (like EngageSphere)
      // No need to emit unreadCountUpdate event here
      
      console.log('Socket: Broadcasted message to room:', appointmentId);

    } catch (error) {
      console.error('Socket: Error processing message:', error);
      // Still broadcast the message even if saving fails
      io.to(data.appointmentId).emit('receiveMessage', data.message);
    }
  });

  // Mark message as delivered
  socket.on('markMessageAsDelivered', async (data) => {
    try {
      const { messageId, appointmentId } = data;
      const message = await Message.findById(messageId);
      
      if (!message) {
        console.log('Socket: Message not found for delivery mark:', messageId);
        return;
      }

      // Update message status to delivered
      if (message.status === "sent") {
        message.status = "delivered";
        message.deliveredAt = new Date();
        await message.save();
        
        // Emit to all users in the appointment room that message was delivered
        const deliveryEvent = {
          messageId: message._id,
          deliveredAt: message.deliveredAt
        };
        io.to(appointmentId).emit('messageDelivered', deliveryEvent);
        
        console.log('Socket: Message marked as delivered:', messageId);
        console.log('Socket: Emitting messageDelivered event to room:', appointmentId, deliveryEvent);
      }
    } catch (error) {
      console.error('Socket: Error marking message as delivered:', error);
    }
  });

  // Mark message as read
  socket.on('markMessageAsRead', async (data) => {
    try {
      const { messageId, appointmentId } = data;
      const message = await Message.findById(messageId);
      
      if (!message) {
        console.log('Socket: Message not found for read mark:', messageId);
        return;
      }

      // Update message status to read
      if (message.status !== "read") {
        message.status = "read";
        message.readAt = new Date();
        await message.save();
        
        // Emit to all users in the appointment room that message was read
        const readEvent = {
          messageId: message._id,
          readAt: message.readAt
        };
        io.to(appointmentId).emit('messageRead', readEvent);
        
        console.log('Socket: Message marked as read:', messageId);
        console.log('Socket: Emitting messageRead event to room:', appointmentId, readEvent);
      }
    } catch (error) {
      console.error('Socket: Error marking message as read:', error);
    }
  });

  // Mark multiple messages as read
  socket.on('markMessagesAsRead', async (data) => {
    try {
      const { messageIds, appointmentId, userId } = data;
      const messages = await Message.find({ _id: { $in: messageIds } });
      
      const readAt = new Date();
      const updatedMessages = [];
      
      for (const message of messages) {
        if (message.status !== "read") {
          message.status = "read";
          message.readAt = readAt;
          await message.save();
          updatedMessages.push(message._id);
        }
      }
      
      if (updatedMessages.length > 0) {
        // Emit to all users in the appointment room that messages were read
        io.to(appointmentId).emit('messagesRead', {
          messageIds: updatedMessages,
          readAt: readAt
        });
        
        // Reset unread count for the user who read the messages
        const conversation = await Conversation.findOne({ appointmentId });
        if (conversation && userId) {
          conversation.unreadCount.set(userId.toString(), 0);
          await conversation.save();
          
          // Emit unread count update to all participants
          const unreadCounts = {};
          for (const [participantId, count] of conversation.unreadCount.entries()) {
            unreadCounts[participantId] = count;
          }
          
          io.to(appointmentId).emit('unreadCountUpdate', {
            appointmentId,
            unreadCounts
          });
          
          console.log('Socket: Reset unread count for user:', userId);
          console.log('Socket: Emitted unread count update:', unreadCounts);
        }
        
        console.log('Socket: Messages marked as read:', updatedMessages.length);
      }
    } catch (error) {
      console.error('Socket: Error marking messages as read:', error);
    }
  });

  // Reset unread count when chat is opened
  socket.on('resetUnreadCount', async (data) => {
    try {
      const { appointmentId, userId } = data;
      console.log('Socket: Resetting unread count for appointment:', appointmentId, 'user:', userId);
      
      const conversation = await Conversation.findOne({ appointmentId });
      if (conversation && userId) {
        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();
        
        // Emit unread count update to all participants
        const unreadCounts = {};
        for (const [participantId, count] of conversation.unreadCount.entries()) {
          unreadCounts[participantId] = count;
        }
        
        io.to(appointmentId).emit('unreadCountUpdate', {
          appointmentId,
          unreadCounts
        });
        
        console.log('Socket: Reset unread count in database for user:', userId);
        console.log('Socket: Emitted unread count update:', unreadCounts);
      }
    } catch (error) {
      console.error('Socket: Error resetting unread count:', error);
    }
  });

  socket.on('disconnect', () => {
    // Handle disconnect if needed
  });
});

// Change app.listen to server.listen
server.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
