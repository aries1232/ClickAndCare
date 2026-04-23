import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { approveExistingDoctors as approveExistingDoctorsApi } from '../services/adminApi';

export const useAdminDashboard = () => {
  const { dashData, getdashboardData, aToken, cancelAppointment } = useContext(AdminContext);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (aToken) getdashboardData();
  }, [aToken]);

  const approveExistingDoctors = async () => {
    setIsApproving(true);
    try {
      const data = await approveExistingDoctorsApi(aToken);
      if (data.success) {
        toast.success(data.message);
        getdashboardData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApproving(false);
    }
  };

  return { dashData, isApproving, approveExistingDoctors, cancelAppointment };
};
