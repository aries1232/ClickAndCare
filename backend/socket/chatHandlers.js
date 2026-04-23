import Conversation from '../models/Conversation.js';
import {
  findOrCreateConversation,
  persistNewMessage,
  incrementUnreadCount,
  resetUnreadForUser,
  unreadCountsToObject,
  updateMessageStatus,
  markManyAsRead,
  buildBroadcastMessage,
} from './messageService.js';

export const registerChatHandlers = (io, socket) => {
  socket.on('joinAppointmentRoom', (appointmentId) => {
    socket.join(appointmentId);
  });

  socket.on('sendMessage', async ({ appointmentId, message }) => {
    try {
      const conversation = await findOrCreateConversation(appointmentId);
      if (!conversation) {
        console.error('Socket: Appointment not found:', appointmentId);
        return;
      }

      const newMessage = await persistNewMessage(conversation, message);

      const senderId = newMessage.senderId.toString();
      const receiverId = newMessage.receiverId.toString();

      if (senderId !== receiverId) {
        await incrementUnreadCount(conversation, newMessage.receiverId);
        io.to(appointmentId).emit('unreadCountUpdate', {
          appointmentId,
          unreadCounts: unreadCountsToObject(conversation),
        });
      }

      io.to(appointmentId).emit('receiveMessage', buildBroadcastMessage(newMessage, appointmentId));
    } catch (error) {
      console.error('Socket: Error processing message:', error);
      io.to(appointmentId).emit('receiveMessage', message);
    }
  });

  socket.on('markMessageAsDelivered', async ({ messageId, appointmentId }) => {
    try {
      const message = await updateMessageStatus(messageId, 'delivered');
      if (!message) return;
      io.to(appointmentId).emit('messageDelivered', {
        messageId: message._id,
        deliveredAt: message.deliveredAt,
      });
    } catch (error) {
      console.error('Socket: Error marking message as delivered:', error);
    }
  });

  socket.on('markMessageAsRead', async ({ messageId, appointmentId }) => {
    try {
      const message = await updateMessageStatus(messageId, 'read');
      if (!message) return;
      io.to(appointmentId).emit('messageRead', {
        messageId: message._id,
        readAt: message.readAt,
      });
    } catch (error) {
      console.error('Socket: Error marking message as read:', error);
    }
  });

  socket.on('markMessagesAsRead', async ({ messageIds, appointmentId, userId }) => {
    try {
      const { updatedIds, readAt } = await markManyAsRead(messageIds);
      if (updatedIds.length === 0) return;

      io.to(appointmentId).emit('messagesRead', { messageIds: updatedIds, readAt });

      if (userId) {
        const conversation = await Conversation.findOne({ appointmentId });
        if (conversation) {
          await resetUnreadForUser(conversation, userId);
          io.to(appointmentId).emit('unreadCountUpdate', {
            appointmentId,
            unreadCounts: unreadCountsToObject(conversation),
          });
        }
      }
    } catch (error) {
      console.error('Socket: Error marking messages as read:', error);
    }
  });

  socket.on('resetUnreadCount', async ({ appointmentId, userId }) => {
    try {
      if (!userId) return;
      const conversation = await Conversation.findOne({ appointmentId });
      if (!conversation) return;
      await resetUnreadForUser(conversation, userId);
      io.to(appointmentId).emit('unreadCountUpdate', {
        appointmentId,
        unreadCounts: unreadCountsToObject(conversation),
      });
    } catch (error) {
      console.error('Socket: Error resetting unread count:', error);
    }
  });
};
