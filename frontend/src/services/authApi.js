import axios from 'axios';

export const loginUser = async (backendUrl, { email, password }) => {
  const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
  return data;
};

export const googleLogin = async (backendUrl, payload) => {
  const { data } = await axios.post(`${backendUrl}/api/user/google-login`, payload);
  return data;
};

export const registerUser = async (backendUrl, { name, email, phone = '0000000000', password }) => {
  const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, phone, password });
  return data;
};

export const verifyOtp = async (backendUrl, { userId, otp }) => {
  const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, { userId, otp });
  return data;
};

export const resendOtp = async (backendUrl, { userId } = {}) => {
  const body = userId ? { userId } : {};
  const { data } = await axios.post(`${backendUrl}/api/user/resend-otp`, body);
  return data;
};

export const forgotPassword = async (backendUrl, { email }) => {
  const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
  return data;
};

export const resetPassword = async (backendUrl, { userId, otp, newPassword }) => {
  const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { userId, otp, newPassword });
  return data;
};
