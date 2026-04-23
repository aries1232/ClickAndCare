import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Publish a message to an SQS queue.
 * @param {string} queueUrl - SQS queue URL from env
 * @param {object} payload - message body (will be JSON stringified)
 * @param {string} messageGroupId - optional, for FIFO queues
 * @returns {string} SQS message ID
 */
export const publishToSQS = async (queueUrl, payload, messageGroupId = null) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(payload),
    ...(messageGroupId && {
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: payload.stripeEventId || Date.now().toString(),
    }),
  };

  const command = new SendMessageCommand(params);
  const result = await sqsClient.send(command);
  return result.MessageId;
};
