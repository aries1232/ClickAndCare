import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchUserUnreadCounts } from '../services/userApi';

export const useAppointmentUnreadCounts = () => {
  const { token, userData } = useContext(AppContext);
  const [unreadCounts, setUnreadCounts] = useState({});

  const refetch = useCallback(async () => {
    if (!token) return;
    try {
      const counts = await fetchUserUnreadCounts({ token });
      setUnreadCounts(counts || {});
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  useEffect(() => {
    if (!userData) return;
    const currentUserId = userData?._id || userData?.id;

    const handleNewMessage = (event) => {
      const { appointmentId, message } = event.detail;
      const isOwnRecent =
        message.createdAt &&
        Date.now() - new Date(message.createdAt).getTime() < 5000 &&
        message.sender?.toString() === currentUserId?.toString();
      if (message.sender && currentUserId && message.sender.toString() !== currentUserId.toString() && !isOwnRecent) {
        setUnreadCounts((prev) => ({
          ...prev,
          [appointmentId]: (prev[appointmentId] || 0) + 1,
        }));
      }
    };

    const handleResetUnreadCount = (event) => {
      const { appointmentId } = event.detail;
      setUnreadCounts((prev) => ({ ...prev, [appointmentId]: 0 }));
    };

    const handleUnreadCountUpdate = (event) => {
      const { appointmentId, unreadCounts: newUnreadCounts } = event.detail;
      if (newUnreadCounts && newUnreadCounts[currentUserId] !== undefined) {
        setUnreadCounts((prev) => ({
          ...prev,
          [appointmentId]: newUnreadCounts[currentUserId],
        }));
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
  }, [userData]);

  return { unreadCounts, refetchUnreadCounts: refetch };
};
