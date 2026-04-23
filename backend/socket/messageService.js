import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import appointmentModel from '../models/appointmentModel.js';

export const findOrCreateConversation = async (appointmentId) => {
  let conversation = await Conversation.findOne({ appointmentId });
  if (conversation) return conversation;

  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment) return null;

  conversation = new Conversation({
    appointmentId,
    participants: [appointment.userId, appointment.docId],
    participantsModel: ['user', 'doctor'],
    messages: [],
    unreadCount: new Map(),
  });
  await conversation.save();
  return conversation;
};

export const persistNewMessage = async (conversation, message) => {
  const senderIsFirstParticipant = conversation.participants[0] === message.sender;

  const newMessage = new Message({
    senderId: message.sender,
    senderModel: senderIsFirstParticipant ? 'user' : 'doctor',
    receiverId: senderIsFirstParticipant ? conversation.participants[1] : conversation.participants[0],
    receiverModel: senderIsFirstParticipant ? 'doctor' : 'user',
    message: message.message,
    messageType: message.messageType || 'text',
    fileUrl: message.fileUrl,
    fileName: message.fileName,
    fileSize: message.fileSize,
    status: 'sent',
  });
  await newMessage.save();

  conversation.messages.push(newMessage._id);
  conversation.lastMessage = newMessage._id;
  conversation.lastMessageTime = new Date();
  await conversation.save();

  return newMessage;
};

export const incrementUnreadCount = async (conversation, receiverId) => {
  const key = receiverId.toString();
  if (!conversation.unreadCount.has(key)) conversation.unreadCount.set(key, 0);
  conversation.unreadCount.set(key, conversation.unreadCount.get(key) + 1);
  await conversation.save();
};

export const resetUnreadForUser = async (conversation, userId) => {
  conversation.unreadCount.set(userId.toString(), 0);
  await conversation.save();
};

export const unreadCountsToObject = (conversation) => {
  const obj = {};
  for (const [k, v] of conversation.unreadCount.entries()) obj[k] = v;
  return obj;
};

export const updateMessageStatus = async (messageId, status) => {
  const message = await Message.findById(messageId);
  if (!message) return null;
  if (status === 'delivered' && message.status !== 'sent') return message;
  if (status === 'read' && message.status === 'read') return message;

  message.status = status;
  if (status === 'delivered') message.deliveredAt = new Date();
  if (status === 'read') message.readAt = new Date();
  await message.save();
  return message;
};

export const markManyAsRead = async (messageIds) => {
  const messages = await Message.find({ _id: { $in: messageIds } });
  const readAt = new Date();
  const updatedIds = [];
  for (const msg of messages) {
    if (msg.status !== 'read') {
      msg.status = 'read';
      msg.readAt = readAt;
      await msg.save();
      updatedIds.push(msg._id);
    }
  }
  return { updatedIds, readAt };
};

export const buildBroadcastMessage = (newMessage, appointmentId) => ({
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
  appointmentId,
});
