import axios from 'axios';

const authHeader = (token) => ({ headers: { token } });

export const fetchUserUnreadCounts = async ({ token }) => {
  const { data } = await axios.get('/api/user/unread-counts', authHeader(token));
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch unread counts');
  }
  return data.unreadCounts;
};

export const getUserProfile = async (token) => {
  const { data } = await axios.get('/api/user/get-profile', authHeader(token));
  return data;
};

export const updateUserProfile = async (token, formData) => {
  const { data } = await axios.post('/api/user/update-profile', formData, authHeader(token));
  return data;
};
