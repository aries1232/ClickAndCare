import express from "express";
import Stripe from "stripe";
import paymentRequestModel from "../models/paymentRequestModel.js";
import { publishToSQS } from "../utils/sqsPublisher.js";

const webhookRouter = express.Router();

// IMPORTANT: Stripe requires raw body for signature verification.
// This route must be registered BEFORE express.json() middleware in server.js.
webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    // 1. Verify Stripe signature
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET);
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`[Webhook] Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2. Only handle checkout.session.completed
    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true });
    }

    const session = event.data.object;
    const stripeEventId = event.id;
    const appointmentId = session.metadata?.appointmentId;
    const userId = session.metadata?.userId || null;
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || "inr";

    if (!appointmentId) {
      console.error(`[Webhook] Missing appointmentId in session metadata. Event: ${stripeEventId}`);
      return res.status(400).json({ error: "Missing appointmentId in metadata" });
    }

    // 3. Idempotency check — if already processed, ack and return
    const existing = await paymentRequestModel.findOne({ stripeEventId });
    if (existing) {
      console.log(`[Webhook] Duplicate event ${stripeEventId}, already ${existing.status}. Skipping.`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // 4. Save PaymentRequest with status QUEUED
    let paymentRequest;
    try {
      paymentRequest = await paymentRequestModel.create({
        stripeEventId,
        appointmentId,
        userId,
        amount,
        currency,
        status: "QUEUED",
      });
      console.log(`[Webhook] PaymentRequest created: ${paymentRequest._id} for appointment ${appointmentId}`);
    } catch (err) {
      console.error(`[Webhook] Failed to save PaymentRequest: ${err.message}`);
      // Return 500 so Stripe retries
      return res.status(500).json({ error: "Failed to save payment request" });
    }

    // 5. Publish to SQS payment-queue
    try {
      const sqsMessageId = await publishToSQS(
        process.env.SQS_PAYMENT_QUEUE_URL,
        {
          eventType: "PAYMENT_SUCCESS",
          stripeEventId,
          appointmentId,
          userId,
          amount,
          currency,
          paymentRequestId: paymentRequest._id.toString(),
        },
        appointmentId // MessageGroupId for FIFO queue
      );

      // Update record with SQS message ID and publish time
      await paymentRequestModel.findByIdAndUpdate(paymentRequest._id, {
        sqsMessageId,
        publishedToSqsAt: new Date(),
      });

      console.log(`[Webhook] Published to SQS. MessageId: ${sqsMessageId}`);
    } catch (err) {
      // SQS publish failed — PaymentRequest stays QUEUED in DB
      // Scheduled job will re-publish. Do NOT return 500 (Stripe already got the event).
      console.error(`[Webhook] SQS publish failed for ${stripeEventId}: ${err.message}`);
    }

    // 6. Always return 200 to Stripe
    return res.status(200).json({ received: true });
  }
);

export default webhookRouter;
