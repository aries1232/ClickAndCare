import { Server as SocketIOServer } from 'socket.io';
import { socketCorsOptions } from '../config/cors.js';
import { registerChatHandlers } from './chatHandlers.js';

export const createSocketServer = (httpServer) => {
  const io = new SocketIOServer(httpServer, { cors: socketCorsOptions });

  io.on('connection', (socket) => {
    registerChatHandlers(io, socket);
    socket.on('disconnect', () => {
      // no-op
    });
  });

  return io;
};
