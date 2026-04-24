import axios from 'axios';

export const getDoctors = async () => {
  const { data } = await axios.post('/api/doctor/get-doctors', {});
  return data;
};

export const getBookedSlots = async (docId) => {
  const { data } = await axios.get(`/api/doctor/booked-slots/${docId}`);
  return data;
};
