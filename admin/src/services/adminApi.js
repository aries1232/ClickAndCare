import axios from 'axios';

const auth = (aToken) => ({ headers: { aToken } });
const authMultipart = (aToken) => ({ headers: { aToken, 'Content-Type': 'multipart/form-data' } });

// Auth
export const adminLogin = async ({ email, password }) => {
  const { data } = await axios.post('/api/admin/login', { email, password });
  return data;
};
export const adminForgotPassword = async ({ email }) => {
  const { data } = await axios.post('/api/admin/forgot-password', { email });
  return data;
};
export const adminResetPassword = async ({ email, otp, newPassword }) => {
  const { data } = await axios.post('/api/admin/reset-password', { email, otp, newPassword });
  return data;
};

// Dashboard / listing
export const getDashboard = async (aToken) => {
  const { data } = await axios.get('/api/admin/dashboard', auth(aToken));
  return data;
};
export const getAllDoctors = async (aToken) => {
  const { data } = await axios.post('/api/admin/all-doctors', {}, auth(aToken));
  return data;
};
export const getAllAppointments = async (aToken) => {
  const { data } = await axios.get('/api/admin/appointments', auth(aToken));
  return data;
};
export const getPendingDoctors = async (aToken) => {
  const { data } = await axios.get('/api/admin/pending-doctors', auth(aToken));
  return data;
};
export const getAdminLogs = async (aToken, params = {}) => {
  const { data } = await axios.get('/api/admin/logs', { ...auth(aToken), params });
  return data;
};

// Doctor management
export const addDoctor = async (aToken, formData) => {
  const { data } = await axios.post('/api/admin/add-doctor', formData, authMultipart(aToken));
  return data;
};
export const approveDoctor = async (aToken, { doctorId, approved }) => {
  const { data } = await axios.post('/api/admin/approve-doctor', { doctorId, approved }, auth(aToken));
  return data;
};
export const approveExistingDoctors = async (aToken) => {
  const { data } = await axios.post('/api/admin/approve-existing-doctors', {}, auth(aToken));
  return data;
};
export const changeDoctorAvailability = async (aToken, docId) => {
  const { data } = await axios.post('/api/admin/change-availablity', { docId }, auth(aToken));
  return data;
};
export const deleteDoctor = async (aToken, doctorId) => {
  const { data } = await axios.delete(`/api/admin/delete-doctor/${doctorId}`, auth(aToken));
  return data;
};
export const updateDoctorInfo = async (aToken, payload) => {
  const { data } = await axios.put('/api/admin/update-doctor-info', payload, auth(aToken));
  return data;
};
export const updateDoctorPicture = async (aToken, formData) => {
  const { data } = await axios.put('/api/admin/update-doctor-picture', formData, authMultipart(aToken));
  return data;
};
export const toggleDoctorVisibility = async (aToken, doctorId) => {
  const { data } = await axios.post('/api/admin/toggle-doctor-visibility', { doctorId }, auth(aToken));
  return data;
};

// Appointments
export const cancelAppointmentAdmin = async (aToken, appointmentId) => {
  const { data } = await axios.post('/api/admin/cancel-appointment', { appointmentId }, auth(aToken));
  return data;
};

// Settings
export const getAdminProfile = async (aToken) => {
  const { data } = await axios.get('/api/admin/profile', auth(aToken));
  return data;
};
export const addRecoveryEmail = async (aToken, payload) => {
  const { data } = await axios.post('/api/admin/recovery-email', payload, auth(aToken));
  return data;
};
export const changeAdminEmail = async (aToken, payload) => {
  const { data } = await axios.put('/api/admin/change-email', payload, auth(aToken));
  return data;
};
export const toggleRecoveryEmail = async (aToken, email) => {
  const { data } = await axios.patch(`/api/admin/recovery-email/${encodeURIComponent(email)}/toggle`, {}, auth(aToken));
  return data;
};
export const removeRecoveryEmail = async (aToken, email) => {
  const { data } = await axios.delete(`/api/admin/recovery-email/${encodeURIComponent(email)}`, auth(aToken));
  return data;
};
