import express from "express";
import cors from "cors";
import "dotenv/config";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from "./config/mongodb.js";
import connectCloudinary from './config/cloudinary.js';
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//app config
const app = express();
const port = process.env.PORT || 3000;
connectDB()
connectCloudinary()

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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken']
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

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
