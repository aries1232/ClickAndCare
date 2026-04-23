import axios from 'axios';

const authHeader = (token) => (token ? { headers: { token } } : {});

export const bookAppointment = async (token, { docId, slotDate, slotTime }) => {
  const { data } = await axios.post('/api/user/book-appointment', { docId, slotDate, slotTime }, authHeader(token));
  return data;
};

export const getMyAppointments = async (token) => {
  const { data } = await axios.get('/api/user/appointments', authHeader(token));
  return data;
};

export const cancelAppointment = async (token, { appointmentId }) => {
  const { data } = await axios.post('/api/user/cancel-appointment', { appointmentId }, authHeader(token));
  return data;
};

export const makePayment = async (token, { appointmentId }) => {
  const { data } = await axios.post('/api/user/make-payment', { appointmentId }, authHeader(token));
  return data;
};

export const updatePaymentStatus = async (token, { appointmentId }) => {
  const { data } = await axios.post('/api/user/update-payment-status', { appointmentId }, authHeader(token));
  return data;
};
