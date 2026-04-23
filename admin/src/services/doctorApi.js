import axios from 'axios';

const auth = (dToken) => ({ headers: { dToken } });
const authMultipart = (dToken) => ({ headers: { dToken, 'Content-Type': 'multipart/form-data' } });

// Auth
export const doctorLogin = async ({ email, password }) => {
  const { data } = await axios.post('/api/doctor/login', { email, password });
  return data;
};
export const sendSignupOtp = async ({ email }) => {
  const { data } = await axios.post('/api/doctor/send-signup-otp', { email });
  return data;
};
export const verifySignupOtp = async ({ email, otp }) => {
  const { data } = await axios.post('/api/doctor/verify-signup-otp', { email, otp });
  return data;
};
export const doctorSignup = async (formData) => {
  const { data } = await axios.post('/api/doctor/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Dashboard / appointments
export const getDoctorDashboard = async (dToken) => {
  const { data } = await axios.get('/api/doctor/dashboard', auth(dToken));
  return data;
};
export const getDoctorAppointments = async (dToken) => {
  const { data } = await axios.get('/api/doctor/appointments', auth(dToken));
  return data;
};
export const completeAppointment = async (dToken, appointmentId) => {
  const { data } = await axios.post('/api/doctor/complete-appointment', { appointmentId }, auth(dToken));
  return data;
};
export const cancelAppointmentDoctor = async (dToken, appointmentId) => {
  const { data } = await axios.post('/api/doctor/cancel-appointment', { appointmentId }, auth(dToken));
  return data;
};

// Profile
export const getDoctorProfile = async (dToken) => {
  const { data } = await axios.get('/api/doctor/profile', auth(dToken));
  return data;
};
export const updateDoctorProfile = async (dToken, payload) => {
  const { data } = await axios.post('/api/doctor/update-profile', payload, auth(dToken));
  return data;
};
export const updateDoctorProfilePicture = async (dToken, formData) => {
  const { data } = await axios.post('/api/doctor/update-profile-picture', formData, authMultipart(dToken));
  return data;
};

// Chat / unread
export const getDoctorUnreadCounts = async (dToken) => {
  const { data } = await axios.get('/api/doctor/unread-counts', auth(dToken));
  return data;
};
export const getDoctorAppointmentChatMessages = async (dToken, appointmentId) => {
  const { data } = await axios.get(`/api/doctor/appointment/${appointmentId}/chat-messages`, auth(dToken));
  return data;
};
