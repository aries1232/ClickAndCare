import { Server as SocketIOServer } from 'socket.io';
import { socketCorsOptions } from '../config/cors.js';
import { registerChatHandlers } from './chatHandlers.js';

export const createSocketServer = (httpServer) => {
  const io = new SocketIOServer(httpServer, { cors: socketCorsOptions });

  // userId → number of currently connected sockets. A user can have multiple
  // tabs/devices open; we only mark them offline when the count drops to 0.
  const presence = new Map();

  const broadcastPresence = () => {
    io.emit('getOnlineUsers', Array.from(presence.keys()));
  };

  io.on('connection', (socket) => {
    const userId = socket.handshake.query?.userId;

    if (userId) {
      presence.set(userId, (presence.get(userId) || 0) + 1);
      broadcastPresence();
    }

    registerChatHandlers(io, socket);

    socket.on('disconnect', () => {
      if (!userId) return;
      const next = (presence.get(userId) || 1) - 1;
      if (next <= 0) presence.delete(userId);
      else presence.set(userId, next);
      broadcastPresence();
    });
  });

  return io;
};
