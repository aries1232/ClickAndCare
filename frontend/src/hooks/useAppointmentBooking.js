import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { AppContext } from '../context/AppContext';
import {
  bookAppointment as bookAppointmentApi,
  makePayment as makePaymentApi,
  cancelAppointment as cancelAppointmentApi,
} from '../services/appointmentApi';
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

  // Booking is now a single user gesture: create the appointment, open the
  // Stripe Checkout session, redirect. No intermediate "Pending Payment"
  // step on /my-appointments. If anything in the chain fails after the
  // appointment row is created, we cancel it so the slot frees instantly.
  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }
    if (!slotTime) {
      toast.error('Please select a time slot');
      return;
    }

    setIsBooking(true);
    let createdAppointmentId = null;
    try {
      const date = docSlot[slotIndex][0].dateTime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

      const bookData = await bookAppointmentApi(token, { docId, slotDate, slotTime });
      if (!bookData.success) {
        toast.error(bookData.message);
        setIsBooking(false);
        return;
      }
      createdAppointmentId = bookData.appointmentId;
      getDoctors();

      const payData = await makePaymentApi(token, { appointmentId: createdAppointmentId });
      if (!payData.success) {
        throw new Error(payData.message || 'Could not start payment.');
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);
      const { error } = await stripe.redirectToCheckout({ sessionId: payData.sessionId });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message || 'Booking failed.');
      // Best-effort: free the slot if we already created a row.
      if (createdAppointmentId) {
        cancelAppointmentApi(token, { appointmentId: createdAppointmentId }).catch(() => {});
      }
      setIsBooking(false);
    }
  };

  return { docId, docInfo, docSlot, slotIndex, setSlotIndex, slotTime, setSlotTime, isBooking, bookAppointment };
};
