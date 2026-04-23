import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    stripeEventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    appointmentId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    status: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "QUEUED",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    sqsMessageId: {
      type: String,
      default: null,
    },
    publishedToSqsAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const paymentRequestModel =
  mongoose.models.PaymentRequest ||
  mongoose.model("PaymentRequest", paymentRequestSchema);

export default paymentRequestModel;
