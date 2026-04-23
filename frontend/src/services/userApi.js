import axios from 'axios';

const authHeader = (token) => ({ headers: { token } });

export const fetchUserUnreadCounts = async ({ backendUrl, token }) => {
  const { data } = await axios.get(`${backendUrl}/api/user/unread-counts`, authHeader(token));
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch unread counts');
  }
  return data.unreadCounts;
};

export const getUserProfile = async (backendUrl, token) => {
  const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, authHeader(token));
  return data;
};

export const updateUserProfile = async (backendUrl, token, formData) => {
  const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, authHeader(token));
  return data;
};
