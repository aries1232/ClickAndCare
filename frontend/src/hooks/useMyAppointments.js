import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useSocketContext } from '../context/SocketContext';
import {
  getMyAppointments as getMyAppointmentsApi,
  cancelAppointment as cancelAppointmentApi,
} from '../services/appointmentApi';
import { getAppointmentChatMessages } from '../services/chatApi';
import { useAppointmentUnreadCounts } from './useAppointmentUnreadCounts';

const PAGE_SIZE = 30;

export const useMyAppointments = () => {
  const { token, getDoctors, userData } = useContext(AppContext);
  const { socket } = useSocketContext();
  const [appointments, setAppointments] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatAppointment, setChatAppointment] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHasMoreOlder, setChatHasMoreOlder] = useState(false);
  const [chatLoadingOlder, setChatLoadingOlder] = useState(false);
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
    setChatHasMoreOlder(false);
    setChatLoading(true);
    try {
      const data = await getAppointmentChatMessages(token, appointment._id, { limit: PAGE_SIZE });
      if (data.success) {
        setChatMessages(data.messages || []);
        setChatHasMoreOlder(!!data.hasMore);
      } else {
        setChatMessages([]);
      }
    } catch {
      setChatMessages([]);
    }
    setChatOpen(true);
    setChatLoading(false);
  };

  const loadOlderMessages = async () => {
    if (!chatAppointment || chatLoadingOlder || !chatHasMoreOlder) return;
    const oldest = chatMessages[0];
    if (!oldest) return;

    setChatLoadingOlder(true);
    try {
      const data = await getAppointmentChatMessages(token, chatAppointment._id, {
        limit: PAGE_SIZE,
        before: oldest.createdAt,
      });
      if (data.success) {
        setChatMessages((prev) => [...(data.messages || []), ...prev]);
        setChatHasMoreOlder(!!data.hasMore);
      }
    } catch {
      /* ignore */
    } finally {
      setChatLoadingOlder(false);
    }
  };

  const closeChat = () => setChatOpen(false);

  useEffect(() => {
    if (token) getMyAppointments();
  }, [token]);

  useEffect(() => {
    if (appointments.length === 0 || !socket) return;
    appointments.forEach((a) => socket.emit('joinAppointmentRoom', a._id));
  }, [appointments, socket]);

  return {
    appointments,
    unreadCounts,
    chatOpen, chatAppointment, chatMessages, chatLoading,
    chatHasMoreOlder, chatLoadingOlder, loadOlderMessages,
    userData,
    socket,
    cancelAppointment,
    handleOpenChat,
    closeChat,
    refreshAppointments: getMyAppointments,
  };
};
