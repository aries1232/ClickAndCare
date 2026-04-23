import axios from 'axios';

const authHeader = (token) => (token ? { headers: { token } } : {});

export const bookAppointment = async (backendUrl, token, { docId, slotDate, slotTime }) => {
  const { data } = await axios.post(
    `${backendUrl}/api/user/book-appointment`,
    { docId, slotDate, slotTime },
    authHeader(token)
  );
  return data;
};

export const getMyAppointments = async (backendUrl, token) => {
  const { data } = await axios.get(`${backendUrl}/api/user/appointments`, authHeader(token));
  return data;
};

export const cancelAppointment = async (backendUrl, token, { appointmentId }) => {
  const { data } = await axios.post(
    `${backendUrl}/api/user/cancel-appointment`,
    { appointmentId },
    authHeader(token)
  );
  return data;
};

export const makePayment = async (backendUrl, token, { appointmentId }) => {
  const { data } = await axios.post(
    `${backendUrl}/api/user/make-payment`,
    { appointmentId },
    authHeader(token)
  );
  return data;
};

export const updatePaymentStatus = async (backendUrl, token, { appointmentId }) => {
  const { data } = await axios.post(
    `${backendUrl}/api/user/update-payment-status`,
    { appointmentId },
    authHeader(token)
  );
  return data;
};
