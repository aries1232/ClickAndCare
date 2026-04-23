import axios from 'axios';

const authHeader = (token) => ({ headers: { token } });

export const getAppointmentChatMessages = async (backendUrl, token, appointmentId) => {
  const { data } = await axios.get(
    `${backendUrl}/api/user/appointment/${appointmentId}/chat-messages`,
    authHeader(token)
  );
  return data;
};

export const uploadChatImage = async (backendUrl, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await axios.post(`${backendUrl}/api/chat/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
