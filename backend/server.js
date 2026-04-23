import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import { createSocketServer } from './socket/index.js';

const port = process.env.PORT || 3000;

connectDB();
connectCloudinary();

const server = http.createServer(app);
createSocketServer(server);

server.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
