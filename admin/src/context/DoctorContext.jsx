import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getDoctorAppointments,
  getDoctorDashboard,
  getDoctorProfile,
  getDoctorUnreadCounts,
  completeAppointment as completeAppointmentApi,
  cancelAppointmentDoctor,
} from '../services/doctorApi';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import {
  DASHBOARD_REFRESH_MS,
  APPOINTMENTS_REFRESH_MS,
  PROFILE_REFRESH_MS,
} from '../utils/constants';

export const DoctorContext = createContext();

const errMsg = (e, fallback) => e.response?.data?.message || e.message || fallback;

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  const totalUnreadCount = Object.values(unreadCounts).reduce((s, c) => s + c, 0);

  const updateUnreadCount = useCallback((appointmentId, count) => {
    setUnreadCounts((prev) => ({ ...prev, [appointmentId]: count }));
  }, []);

  const incrementUnreadCount = useCallback((appointmentId) => {
    setUnreadCounts((prev) => ({ ...prev, [appointmentId]: (prev[appointmentId] || 0) + 1 }));
  }, []);

  const resetUnreadCount = useCallback((appointmentId) => {
    setUnreadCounts((prev) => ({ ...prev, [appointmentId]: 0 }));
  }, []);

  const getUnreadCounts = useCallback(async () => {
    try {
      const data = await getDoctorUnreadCounts(dToken);
      if (data.success) setUnreadCounts(data.unreadCounts);
    } catch (e) {
      console.error('DoctorContext: Error fetching unread counts:', e);
    }
  }, [dToken]);

  const getAppointments = useCallback(async () => {
    try {
      const data = await getDoctorAppointments(dToken);
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to fetch appointments'));
    }
  }, [dToken]);

  const getDashData = useCallback(async () => {
    try {
      const data = await getDoctorDashboard(dToken);
      if (data.success) setDashData(data.dashData);
      else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to fetch dashboard data'));
    }
  }, [dToken]);

  const getProfileData = useCallback(async () => {
    try {
      const data = await getDoctorProfile(dToken);
      if (data.success) setProfileData(data.doctorData);
      else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to fetch profile'));
    }
  }, [dToken]);

  const completeAppointment = async (appointmentId) => {
    setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? { ...a, isCompleted: true } : a)));
    try {
      const data = await completeAppointmentApi(dToken, appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
        getAppointments();
      }
    } catch (e) {
      toast.error(errMsg(e, 'Failed to complete appointment'));
      getAppointments();
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? { ...a, cancelled: true } : a)));
    try {
      const data = await cancelAppointmentDoctor(dToken, appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
        getAppointments();
      }
    } catch (e) {
      toast.error(errMsg(e, 'Failed to cancel appointment'));
      getAppointments();
    }
  };

  useEffect(() => {
    if (dToken) {
      getDashData();
      getAppointments();
      getProfileData();
      getUnreadCounts();
    }
  }, [dToken, getDashData, getAppointments, getProfileData, getUnreadCounts]);

  // Polling: dashboard/appointments/profile only. Unread counts are now
  // socket-driven (see DOM event listeners below, bridged from the server
  // via SocketContext).
  useAutoRefresh(
    [
      { fn: () => dToken && getDashData(), ms: DASHBOARD_REFRESH_MS },
      { fn: () => dToken && getAppointments(), ms: APPOINTMENTS_REFRESH_MS },
      { fn: () => dToken && getProfileData(), ms: PROFILE_REFRESH_MS },
    ],
    !!dToken,
  );

  useEffect(() => {
    if (dToken && profileData) getUnreadCounts();
  }, [dToken, profileData, getUnreadCounts]);

  // Socket-driven DOM events for unread-count updates
  useEffect(() => {
    if (!dToken || !profileData) return undefined;
    const currentUserId = profileData?._id || profileData?.id;

    const handleNewMessage = (event) => {
      const { appointmentId, message } = event.detail;
      const isOwnRecent =
        message.createdAt &&
        Date.now() - new Date(message.createdAt).getTime() < 5000 &&
        message.sender?.toString() === currentUserId?.toString();
      if (message.sender && currentUserId && message.sender.toString() !== currentUserId.toString() && !isOwnRecent) {
        incrementUnreadCount(appointmentId);
      }
    };

    const handleResetUnreadCount = (event) => {
      resetUnreadCount(event.detail.appointmentId);
    };

    const handleUnreadCountUpdate = (event) => {
      const { appointmentId, unreadCounts: newUnreadCounts } = event.detail;
      if (newUnreadCounts && newUnreadCounts[currentUserId] !== undefined) {
        updateUnreadCount(appointmentId, newUnreadCounts[currentUserId]);
      }
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('resetUnreadCount', handleResetUnreadCount);
    window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('resetUnreadCount', handleResetUnreadCount);
      window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate);
    };
  }, [dToken, profileData, incrementUnreadCount, resetUnreadCount, updateUnreadCount]);

  const value = {
    backendUrl,
    dToken, setDToken,
    appointments, setAppointments, getAppointments,
    completeAppointment, cancelAppointment,
    dashData, setDashData, getDashData,
    profileData, setProfileData, getProfileData,
    unreadCounts, setUnreadCounts,
    getUnreadCounts, updateUnreadCount, incrementUnreadCount, resetUnreadCount,
    totalUnreadCount,
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
