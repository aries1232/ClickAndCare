import paymentRequestModel from "../models/paymentRequestModel.js";
import { publishToSQS } from "./sqsPublisher.js";

const STUCK_THRESHOLD_MINUTES = 5;

/**
 * Scans for PaymentRequest records stuck in QUEUED status
 * (meaning SQS publish failed at webhook time) and re-publishes them.
 * Runs on an interval — safe to restart, idempotent.
 */
export const runPaymentRecoveryJob = async () => {
  try {
    const thresholdTime = new Date(Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000);

    const stuckRecords = await paymentRequestModel.find({
      status: "QUEUED",
      publishedToSqsAt: null,
      createdAt: { $lt: thresholdTime },
    });

    if (stuckRecords.length === 0) return;

    console.log(`[PaymentRecovery] Found ${stuckRecords.length} stuck QUEUED record(s). Re-publishing...`);

    for (const record of stuckRecords) {
      try {
        const sqsMessageId = await publishToSQS(
          process.env.SQS_PAYMENT_QUEUE_URL,
          {
            eventType: "PAYMENT_SUCCESS",
            stripeEventId: record.stripeEventId,
            appointmentId: record.appointmentId,
            userId: record.userId,
            amount: record.amount,
            currency: record.currency,
            paymentRequestId: record._id.toString(),
          },
          record.appointmentId // MessageGroupId for FIFO queue
        );

        await paymentRequestModel.findByIdAndUpdate(record._id, {
          sqsMessageId,
          publishedToSqsAt: new Date(),
        });

        console.log(`[PaymentRecovery] Re-published stripeEventId=${record.stripeEventId} sqsMessageId=${sqsMessageId}`);
      } catch (err) {
        console.error(`[PaymentRecovery] Failed to re-publish stripeEventId=${record.stripeEventId}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`[PaymentRecovery] Job error: ${err.message}`);
  }
};

/**
 * Start the recovery job on an interval.
 * @param {number} intervalMs - how often to run (default: every 2 minutes)
 */
export const startPaymentRecoveryJob = (intervalMs = 2 * 60 * 1000) => {
  console.log(`[PaymentRecovery] Starting recovery job. Interval: ${intervalMs / 1000}s`);
  setInterval(runPaymentRecoveryJob, intervalMs);
};
