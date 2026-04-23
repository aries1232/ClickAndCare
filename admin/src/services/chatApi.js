import axios from 'axios';

export const uploadChatImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await axios.post('/api/chat/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
