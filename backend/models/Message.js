import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['user', 'doctor'],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverModel',
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ['user', 'doctor'],
    },
    message: {
      type: String,
      default: "",
    },
    messageType: {
      type: String,
      enum: ["text", "image", "document"],
      default: "text",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'deletedForModel',
      },
    ],
    deletedForModel: [
      {
        type: String,
        enum: ['user', 'doctor'],
      },
    ],
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'reactions.userModel',
          required: true,
        },
        userModel: {
          type: String,
          enum: ['user', 'doctor'],
          required: true,
        },
        emoji: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message; 