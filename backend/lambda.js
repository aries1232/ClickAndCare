// AWS Lambda entrypoint. Wraps the Express app with serverless-http and
// caches the Mongo connection across invocations so warm invocations skip
// the ~300ms handshake.
//
// Socket.IO is NOT run here — Lambda can't hold persistent connections.
// The long-lived socket server stays on your always-on host (Render/Fly/EC2).

import 'dotenv/config';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import app from './app.js';

// ---- Cloudinary (sync, no network) -----------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// ---- Mongo connection cache -------------------------------------------------
// Lambda re-uses the Node runtime across warm invocations, so we keep a
// singleton promise for the connection. `bufferCommands: false` means queries
// fail fast instead of queueing if Mongo is down (avoids hanging requests).
let connectionPromise = null;
const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(`${process.env.MONGODB_URI}/Click&Care`, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      })
      .catch((err) => {
        // Reset so the next invocation retries.
        connectionPromise = null;
        throw err;
      });
  }
  await connectionPromise;
};

// ---- Handler ----------------------------------------------------------------
const wrapped = serverless(app, {
  binary: ['multipart/form-data', 'application/octet-stream', 'image/*'],
});

export const main = async (event, context) => {
  // Keep the Lambda container alive after we return so Mongo's connection
  // pool survives between invocations.
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToMongo();
  return wrapped(event, context);
};
