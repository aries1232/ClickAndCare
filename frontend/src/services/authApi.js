import axios from 'axios';

export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post('/api/user/login', { email, password });
  return data;
};

export const googleLogin = async (payload) => {
  const { data } = await axios.post('/api/user/google-login', payload);
  return data;
};

export const registerUser = async ({ name, email, phone = '0000000000', password }) => {
  const { data } = await axios.post('/api/user/register', { name, email, phone, password });
  return data;
};

export const verifyOtp = async ({ userId, otp }) => {
  const { data } = await axios.post('/api/user/verify-otp', { userId, otp });
  return data;
};

export const resendOtp = async ({ userId } = {}) => {
  const body = userId ? { userId } : {};
  const { data } = await axios.post('/api/user/resend-otp', body);
  return data;
};

export const forgotPassword = async ({ email }) => {
  const { data } = await axios.post('/api/user/forgot-password', { email });
  return data;
};

export const resetPassword = async ({ userId, otp, newPassword }) => {
  const { data } = await axios.post('/api/user/reset-password', { userId, otp, newPassword });
  return data;
};
