import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const clearChatData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all conversations
    const conversationResult = await Conversation.deleteMany({});
    console.log(`Deleted ${conversationResult.deletedCount} conversations`);

    // Delete all messages
    const messageResult = await Message.deleteMany({});
    console.log(`Deleted ${messageResult.deletedCount} messages`);

    console.log('All chat data cleared successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error clearing chat data:', error);
    process.exit(1);
  }
};

// Run the script
clearChatData(); 