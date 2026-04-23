import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { getDoctors as getDoctorsApi } from '../services/doctorApi';
import { getUserProfile } from '../services/userApi';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';

  const [token, setToken] = useState(localStorage.getItem('token') || false);
  const [userData, setUserData] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const data = await getDoctorsApi();
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const data = await getUserProfile(token);
      if (data.success) setUserData(data.userData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    if (token) loadUserProfileData();
    else setUserData(false);
  }, [token]);

  const value = {
    doctors,
    token, setToken,
    userData, setUserData,
    loadUserProfileData, getDoctors,
    currencySymbol,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
