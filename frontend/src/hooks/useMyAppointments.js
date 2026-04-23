import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { AppContext } from '../context/AppContext';
import { useSocketContext } from '../context/SocketContext';
import {
  getMyAppointments as getMyAppointmentsApi,
  cancelAppointment as cancelAppointmentApi,
  makePayment as makePaymentApi,
} from '../services/appointmentApi';
import { getAppointmentChatMessages } from '../services/chatApi';
import { useAppointmentUnreadCounts } from './useAppointmentUnreadCounts';

export const useMyAppointments = () => {
  const { token, getDoctors, userData } = useContext(AppContext);
  const { socket } = useSocketContext();
  const [appointments, setAppointments] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatAppointment, setChatAppointment] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const { unreadCounts } = useAppointmentUnreadCounts();

  const getMyAppointments = async () => {
    try {
      const data = await getMyAppointmentsApi(token);
      if (data.success) {
        setAppointments(data.data.sort((a, b) => b.date - a.date));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePaynow = async (appointmentId) => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);
    try {
      const data = await makePaymentApi(token, { appointmentId });
      if (data.success) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Payment initiation failed.');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const data = await cancelAppointmentApi(token, { appointmentId });
      if (data.success) {
        toast.success(data.message);
        getMyAppointments();
        getDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOpenChat = async (appointment) => {
    setChatAppointment(appointment);
    setChatMessages([]);
    setChatLoading(true);
    try {
      const data = await getAppointmentChatMessages(token, appointment._id);
      setChatMessages(data.success ? data.messages || [] : []);
    } catch {
      setChatMessages([]);
    }
    setChatOpen(true);
    setChatLoading(false);
  };

  const closeChat = () => setChatOpen(false);

  useEffect(() => {
    if (token) getMyAppointments();
  }, [token]);

  // Join socket rooms for all appointments
  useEffect(() => {
    if (appointments.length === 0 || !socket) return;
    appointments.forEach((a) => socket.emit('joinAppointmentRoom', a._id));
  }, [appointments, socket]);

  return {
    appointments,
    unreadCounts,
    chatOpen, chatAppointment, chatMessages, chatLoading,
    userData,
    socket,
    handlePaynow,
    cancelAppointment,
    handleOpenChat,
    closeChat,
    refreshAppointments: getMyAppointments,
  };
};
