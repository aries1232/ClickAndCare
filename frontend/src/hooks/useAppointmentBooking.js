import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { bookAppointment as bookAppointmentApi } from '../services/appointmentApi';
import { useSlotGeneration } from './useSlotGeneration';

export const useAppointmentBooking = () => {
  const { docId } = useParams();
  const { doctors, token, getDoctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const { docSlot, slotIndex, setSlotIndex, slotTime, setSlotTime } = useSlotGeneration(docInfo);

  useEffect(() => {
    if (doctors.length === 0) return;
    setDocInfo(doctors.find((doc) => doc._id === docId) || null);
  }, [doctors, docId]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }
    if (!slotTime) {
      toast.error('Please select a time slot');
      return;
    }

    setIsBooking(true);
    try {
      const date = docSlot[slotIndex][0].dateTime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
      const data = await bookAppointmentApi(token, { docId, slotDate, slotTime });

      if (data.success) {
        toast.success(data.message);
        getDoctors();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  return { docId, docInfo, docSlot, slotIndex, setSlotIndex, slotTime, setSlotTime, isBooking, bookAppointment };
};
