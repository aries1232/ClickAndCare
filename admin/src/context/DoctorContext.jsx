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
  const [unreadCounts, setUnreadCounts] = useState({});
  
  // Real-time update intervals
  const dashboardIntervalRef = useRef(null);
  const appointmentsIntervalRef = useRef(null);
  const profileIntervalRef = useRef(null);
  const unreadCountsIntervalRef = useRef(null);
  
  // Auto-refresh intervals (in milliseconds)
  const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds
  const APPOINTMENTS_REFRESH_INTERVAL = 20000; // 20 seconds
  const PROFILE_REFRESH_INTERVAL = 60000; // 60 seconds
  const UNREAD_COUNTS_REFRESH_INTERVAL = 15000; // 15 seconds

  // Calculate total unread count
  const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  // Debug total unread count changes
  useEffect(() => {
    if (totalUnreadCount > 0) {
      console.log('DoctorContext: Total unread count:', totalUnreadCount);
    }
  }, [totalUnreadCount]);

  const getUnreadCounts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/unread-counts", {
        headers: { dToken },
      });
      if (data.success) {
        // console.log('DoctorContext: Received unread counts:', data.unreadCounts);
        setUnreadCounts(data.unreadCounts);
      } else {
        console.error('DoctorContext: Failed to fetch unread counts:', data.message);
      }
    } catch (error) {
      console.error('DoctorContext: Error fetching unread counts:', error);
    }
  };

  const updateUnreadCount = (appointmentId, count) => {
    setUnreadCounts(prev => ({
      ...prev,
      [appointmentId]: count
    }));
  };

  const incrementUnreadCount = (appointmentId) => {
    setUnreadCounts(prev => {
      const currentCount = prev[appointmentId] || 0;
      return {
        ...prev,
        [appointmentId]: currentCount + 1
      };
    });
  };

  const resetUnreadCount = (appointmentId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [appointmentId]: 0
    }));
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/appointments", {
        headers: { dToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
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
      toast.error(error.response?.data?.message || "Failed to complete appointment");
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
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
      // Revert optimistic update on error
      getAppointments()
    }
  }

  const getDashData = async () => {
    try {

      const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})

      if(data.success){
        setDashData(data.dashData)
      }
      else{
        toast.error(data.message)
      }
    
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      
    }
  }

  const getProfileData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/doctor/profile',{headers:{dToken}})
      if(data.success){
        setProfileData(data.doctorData)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      
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

    // Start unread counts auto-refresh
    unreadCountsIntervalRef.current = setInterval(() => {
      if (dToken) {
        getUnreadCounts();
      }
    }, UNREAD_COUNTS_REFRESH_INTERVAL);
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
    if (unreadCountsIntervalRef.current) {
      clearInterval(unreadCountsIntervalRef.current);
      unreadCountsIntervalRef.current = null;
    }
  };

  // Initialize data and start auto-refresh when token changes
  useEffect(() => {
    if (dToken) {
      // Initial data load
      getDashData();
      getAppointments();
      getProfileData();
      getUnreadCounts(); // Initial unread count fetch
      
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

  // Fetch unread counts when profile data is loaded (for socket events)
  useEffect(() => {
    if (dToken && profileData) {
      getUnreadCounts();
    }
  }, [dToken, profileData]);

  // Socket event listeners for real-time unread count updates
  useEffect(() => {
    if (!dToken || !profileData) return;

    const handleNewMessage = (event) => {
      const { appointmentId, message } = event.detail;
      const currentUserId = profileData?._id || profileData?.id;
      
      // Check if this is the doctor's own message (sent within last 5 seconds)
      const isOwnRecentMessage = message.createdAt && 
        (new Date() - new Date(message.createdAt)) < 5000 && 
        message.sender && currentUserId && 
        message.sender.toString() === currentUserId.toString();
      
      // Only increment unread count if message is from the other person
      // Convert both to strings for reliable comparison
      if (message.sender && currentUserId && 
          message.sender.toString() !== currentUserId.toString() && 
          !isOwnRecentMessage) {
        incrementUnreadCount(appointmentId);
      }
    };

    const handleResetUnreadCount = (event) => {
      const { appointmentId } = event.detail;
      resetUnreadCount(appointmentId);
    };

    const handleUnreadCountUpdate = (event) => {
      const { appointmentId, unreadCounts: newUnreadCounts } = event.detail;
      const currentUserId = profileData?._id || profileData?.id;
      
      if (newUnreadCounts && newUnreadCounts[currentUserId] !== undefined) {
        updateUnreadCount(appointmentId, newUnreadCounts[currentUserId]);
      }
    };

    // Add event listeners
    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('resetUnreadCount', handleResetUnreadCount);
    window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('resetUnreadCount', handleResetUnreadCount);
      window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate);
    };
  }, [dToken, profileData, incrementUnreadCount, resetUnreadCount, updateUnreadCount]);

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
    stopAutoRefresh,
    unreadCounts,
    setUnreadCounts,
    getUnreadCounts,
    updateUnreadCount,
    incrementUnreadCount,
    resetUnreadCount,
    totalUnreadCount
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
