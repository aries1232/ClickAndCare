import axios from 'axios';

const authHeader = (token) => ({ headers: { token } });

/**
 * @param {string} token
 * @param {string} appointmentId
 * @param {object} [opts]
 * @param {number} [opts.limit=30]
 * @param {string|Date} [opts.before] ISO timestamp of the oldest message currently in view;
 *   pass this to load the page just before it.
 */
export const getAppointmentChatMessages = async (token, appointmentId, opts = {}) => {
  const params = {};
  if (opts.limit != null) params.limit = opts.limit;
  if (opts.before) params.before = opts.before;
  const { data } = await axios.get(
    `/api/user/appointment/${appointmentId}/chat-messages`,
    { ...authHeader(token), params },
  );
  return data;
};

export const uploadChatImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await axios.post('/api/chat/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
