import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  
  // Real-time update intervals
  const dashboardIntervalRef = useRef(null);
  const appointmentsIntervalRef = useRef(null);
  const profileIntervalRef = useRef(null);
  
  // Auto-refresh intervals (in milliseconds)
  const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds
  const APPOINTMENTS_REFRESH_INTERVAL = 20000; // 20 seconds
  const PROFILE_REFRESH_INTERVAL = 60000; // 60 seconds

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/appointments", {
        headers: { dToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
        // console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) =>{
    // Optimistic update - immediately update UI
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, isCompleted: true }
          : appointment
      )
    );

    try {
      const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})
      
      if(data.success){
        toast.success(data.message)
        // Refresh to ensure consistency
        getAppointments()
        getDashData() // Update dashboard stats
      }
      else{
        toast.error(data.message)
        // Revert optimistic update on error
        getAppointments()
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      // Revert optimistic update on error
      getAppointments()
    }
  }

  const cancelAppointment = async (appointmentId) =>{
    // Optimistic update - immediately update UI
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, cancelled: true }
          : appointment
      )
    );

    try {
      const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})
      
      if(data.success){
        toast.success(data.message)
        // Refresh to ensure consistency
        getAppointments()
        getDashData() // Update dashboard stats
      }
      else{
        toast.error(data.message)
        // Revert optimistic update on error
        getAppointments()
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      // Revert optimistic update on error
      getAppointments()
    }
  }

  const getDashData = async () => {
    try {

      const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})

      if(data.success){
        setDashData(data.dashData)
        //console.log(data.dashData);
      }
      else{
        toast.error(data.message)
      }
    
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  const getProfileData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/doctor/profile',{headers:{dToken}})
      if(data.success){
        setProfileData(data.doctorData)
        //console.log(data.doctorData);
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  // Start auto-refresh intervals
  const startAutoRefresh = () => {
    // Clear existing intervals
    stopAutoRefresh();
    
    // Start dashboard auto-refresh
    dashboardIntervalRef.current = setInterval(() => {
      if (dToken) {
        getDashData();
      }
    }, DASHBOARD_REFRESH_INTERVAL);
    
    // Start appointments auto-refresh
    appointmentsIntervalRef.current = setInterval(() => {
      if (dToken) {
        getAppointments();
      }
    }, APPOINTMENTS_REFRESH_INTERVAL);
    
    // Start profile auto-refresh
    profileIntervalRef.current = setInterval(() => {
      if (dToken) {
        getProfileData();
      }
    }, PROFILE_REFRESH_INTERVAL);
  };

  // Stop auto-refresh intervals
  const stopAutoRefresh = () => {
    if (dashboardIntervalRef.current) {
      clearInterval(dashboardIntervalRef.current);
      dashboardIntervalRef.current = null;
    }
    if (appointmentsIntervalRef.current) {
      clearInterval(appointmentsIntervalRef.current);
      appointmentsIntervalRef.current = null;
    }
    if (profileIntervalRef.current) {
      clearInterval(profileIntervalRef.current);
      profileIntervalRef.current = null;
    }
  };

  // Initialize data and start auto-refresh when token changes
  useEffect(() => {
    if (dToken) {
      // Initial data load
      getDashData();
      getAppointments();
      getProfileData();
      
      // Start auto-refresh
      startAutoRefresh();
    } else {
      // Stop auto-refresh when logged out
      stopAutoRefresh();
    }
    
    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, [dToken]);

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    startAutoRefresh,
    stopAutoRefresh
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
