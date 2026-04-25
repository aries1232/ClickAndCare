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

// Verifies the Stripe Checkout session server-side and returns the
// appointmentId to display on the success page. Does NOT itself flip
// `payment` — that's the webhook's job.
export const verifyPayment = async (token, sessionId) => {
  const { data } = await axios.get('/api/user/verify-payment', {
    params: { session_id: sessionId },
    ...authHeader(token),
  });
  return data;
};

// Called from the cancel page so the soft lock drops immediately instead
// of waiting on Stripe's `checkout.session.expired` webhook.
export const releaseLock = async (token, { appointmentId }) => {
  const { data } = await axios.post('/api/user/release-lock', { appointmentId }, authHeader(token));
  return data;
};

// Kick off (or short-circuit) receipt generation for a paid appointment.
// Backend proxies to fileweaver. Returns either:
//   { success:true, ready:true,  downloadUrl }   ← already generated
//   { success:true, ready:false, jobId }         ← in progress, poll status
export const requestReceipt = async (token, appointmentId) => {
  const { data } = await axios.post(
    `/api/user/appointments/${appointmentId}/receipt`,
    {},
    authHeader(token),
  );
  return data;
};

// Poll for completion. Returns { ready: bool, status, downloadUrl? }.
export const getReceiptStatus = async (token, appointmentId, jobId) => {
  const { data } = await axios.get(
    `/api/user/appointments/${appointmentId}/receipt/status`,
    { params: { jobId }, ...authHeader(token) },
  );
  return data;
};
