import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getDashboard,
  getAllDoctors as getAllDoctorsApi,
  getAllAppointments as getAllAppointmentsApi,
  changeDoctorAvailability,
  cancelAppointmentAdmin,
  deleteDoctor as deleteDoctorApi,
  updateDoctorInfo as updateDoctorInfoApi,
  updateDoctorPicture,
  toggleDoctorVisibility as toggleDoctorVisibilityApi,
} from '../services/adminApi';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import {
  DASHBOARD_REFRESH_MS,
  APPOINTMENTS_REFRESH_MS,
  DOCTORS_REFRESH_MS,
} from '../utils/constants';

export const AdminContext = createContext();

const errMsg = (e, fallback) => e.response?.data?.message || e.message || fallback;

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [isLoading, setIsLoading] = useState({ dashboard: false, doctors: false, appointments: false });
  const [lastUpdated, setLastUpdated] = useState({ dashboard: null, doctors: null, appointments: null });

  const getdashboardData = useCallback(async () => {
    setIsLoading((p) => ({ ...p, dashboard: true }));
    try {
      const data = await getDashboard(aToken);
      if (data.success) {
        setDashData(data.dashData);
        setLastUpdated((p) => ({ ...p, dashboard: new Date() }));
      } else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading((p) => ({ ...p, dashboard: false }));
    }
  }, [aToken]);

  const getAllDoctors = useCallback(async () => {
    setIsLoading((p) => ({ ...p, doctors: true }));
    try {
      const data = await getAllDoctorsApi(aToken);
      if (data.success) {
        setDoctors(data.doctors);
        setLastUpdated((p) => ({ ...p, doctors: new Date() }));
      } else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading((p) => ({ ...p, doctors: false }));
    }
  }, [aToken]);

  const getAllAppointments = useCallback(async () => {
    try {
      const data = await getAllAppointmentsApi(aToken);
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to fetch appointments'));
    }
  }, [aToken]);

  const changeAvailability = async (docId) => {
    setDoctors((prev) => prev.map((d) => (d._id === docId ? { ...d, available: !d.available } : d)));
    try {
      const data = await changeDoctorAvailability(aToken, docId);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        getdashboardData();
      } else {
        toast.error(data.message);
        getAllDoctors();
      }
    } catch (e) {
      toast.error(e.message);
      getAllDoctors();
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? { ...a, cancelled: true } : a)));
    try {
      const data = await cancelAppointmentAdmin(aToken, appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getdashboardData();
      } else {
        toast.error(data.message);
        getAllAppointments();
      }
    } catch (e) {
      toast.error(errMsg(e, 'Failed to cancel appointment'));
      getAllAppointments();
    }
  };

  const cancelAppointmentSilent = async (appointmentId) => {
    try {
      const data = await cancelAppointmentAdmin(aToken, appointmentId);
      return !!data.success;
    } catch {
      return false;
    }
  };

  const deleteDoctor = async (doctorId) => {
    try {
      const data = await deleteDoctorApi(aToken, doctorId);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        getAllAppointments();
        getdashboardData();
      } else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to delete doctor'));
    }
  };

  const updateDoctorInfo = async (doctorId, updateData) => {
    try {
      const data = await updateDoctorInfoApi(aToken, { doctorId, ...updateData });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        getdashboardData();
      } else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to update doctor info'));
    }
  };

  const updateDoctorProfilePicture = async (doctorId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('doctorId', doctorId);
      formData.append('image', imageFile);
      const data = await updateDoctorPicture(aToken, formData);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to update doctor picture'));
    }
  };

  const toggleDoctorVisibility = async (doctorId) => {
    try {
      const data = await toggleDoctorVisibilityApi(aToken, doctorId);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        getdashboardData();
      } else toast.error(data.message);
    } catch (e) {
      toast.error(errMsg(e, 'Failed to toggle doctor visibility'));
    }
  };

  useEffect(() => {
    if (aToken) {
      getdashboardData();
      getAllDoctors();
      getAllAppointments();
    }
  }, [aToken, getdashboardData, getAllDoctors, getAllAppointments]);

  useAutoRefresh(
    [
      { fn: () => aToken && getdashboardData(), ms: DASHBOARD_REFRESH_MS },
      { fn: () => aToken && getAllDoctors(), ms: DOCTORS_REFRESH_MS },
      { fn: () => aToken && getAllAppointments(), ms: APPOINTMENTS_REFRESH_MS },
    ],
    !!aToken,
  );

  const value = {
    backendUrl,
    aToken, setAToken,
    doctors, getAllDoctors, changeAvailability,
    appointments, setAppointments, getAllAppointments,
    dashData, getdashboardData,
    cancelAppointment, cancelAppointmentSilent,
    deleteDoctor, updateDoctorInfo, updateDoctorProfilePicture, toggleDoctorVisibility,
    isLoading, lastUpdated,
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
