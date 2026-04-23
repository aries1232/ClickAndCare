import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const getChatDebug = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const conversation = await Conversation.findOne({ appointmentId }).populate('messages');

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
          createdAt: msg.createdAt,
        })) || [],
      } : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearAllChatData = async (req, res) => {
  try {
    const conversationResult = await Conversation.deleteMany({});
    const messageResult = await Message.deleteMany({});

    res.json({
      success: true,
      message: 'All chat data cleared successfully!',
      deletedConversations: conversationResult.deletedCount,
      deletedMessages: messageResult.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing chat data:', error);
    res.status(500).json({ error: error.message });
  }
};
