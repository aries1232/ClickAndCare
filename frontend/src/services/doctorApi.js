import axios from 'axios';

export const getDoctors = async () => {
  const { data } = await axios.post('/api/doctor/get-doctors', {});
  return data;
};
