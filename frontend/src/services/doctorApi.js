import axios from 'axios';

export const getDoctors = async (backendUrl) => {
  const { data } = await axios.post(`${backendUrl}/api/doctor/get-doctors`, {});
  return data;
};
