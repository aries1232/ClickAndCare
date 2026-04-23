import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

const transform = (msg) => ({
  _id: msg._id,
  sender: msg.senderId,
  message: msg.message,
  messageType: msg.messageType,
  fileUrl: msg.fileUrl,
  fileName: msg.fileName,
  fileSize: msg.fileSize,
  status: msg.status,
  deliveredAt: msg.deliveredAt,
  readAt: msg.readAt,
  time: new Date(msg.createdAt).toLocaleTimeString(),
  createdAt: msg.createdAt,
});

/**
 * Cursor-paginated chat messages for an appointment.
 * Returns up to `limit` messages older than `before` (if provided), newest-first
 * on the wire; we reverse to chronological ASC so the client can append without
 * re-sorting. `hasMore` tells the client whether there are older pages.
 */
export const getPaginatedMessages = async ({ appointmentId, limit, before }) => {
  if (!appointmentId) return { error: { status: 400, message: 'Missing appointmentId' } };

  const clampedLimit = (() => {
    const n = Number(limit);
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
    return Math.min(n, MAX_LIMIT);
  })();

  const conversation = await Conversation.findOne({ appointmentId }).select('_id messages').lean();
  if (!conversation) return { error: { status: 404, message: 'No chat found for this appointment' } };

  const query = { _id: { $in: conversation.messages } };
  if (before) {
    const beforeDate = new Date(before);
    if (!Number.isNaN(beforeDate.getTime())) query.createdAt = { $lt: beforeDate };
  }

  const rows = await Message.find(query).sort({ createdAt: -1 }).limit(clampedLimit + 1).lean();
  const hasMore = rows.length > clampedLimit;
  const page = hasMore ? rows.slice(0, clampedLimit) : rows;
  const messages = page.map(transform).reverse();

  const nextBefore = hasMore ? page[page.length - 1]?.createdAt : null;

  return { messages, hasMore, nextBefore };
};
