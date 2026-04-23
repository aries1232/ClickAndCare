import { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchUserUnreadCounts } from '../services/userApi';

const POLL_INTERVAL_MS = 30000;

export const useUnreadCounts = () => {
  const { token, backendUrl, userData } = useContext(AppContext);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const refetch = useCallback(async () => {
    if (!token || !backendUrl || !userData?._id) return;
    try {
      const counts = await fetchUserUnreadCounts({ backendUrl, token });
      const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
      setTotalUnreadCount(total);
    } catch {
      setTotalUnreadCount(0);
    }
  }, [token, backendUrl, userData?._id]);

  useEffect(() => {
    if (!(token && backendUrl && userData?._id)) return;
    refetch();
    const id = setInterval(refetch, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [token, backendUrl, userData, refetch]);

  useEffect(() => {
    const currentUserId = userData?._id || userData?.id;

    const handleUnreadCountUpdate = (event) => {
      const { unreadCounts: newUnreadCounts } = event.detail;
      if (newUnreadCounts && newUnreadCounts[currentUserId] !== undefined) {
        const newTotal = Object.values(newUnreadCounts).reduce((s, c) => s + c, 0);
        setTotalUnreadCount(newTotal);
      }
    };

    const handleResetUnreadCount = () => {
      refetch();
    };

    const handleNewMessage = (event) => {
      const { message } = event.detail;
      if (message.sender !== currentUserId) {
        refetch();
      }
    };

    window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate);
    window.addEventListener('resetUnreadCount', handleResetUnreadCount);
    window.addEventListener('newMessage', handleNewMessage);

    return () => {
      window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate);
      window.removeEventListener('resetUnreadCount', handleResetUnreadCount);
      window.removeEventListener('newMessage', handleNewMessage);
    };
  }, [userData?._id, userData?.id, refetch]);

  return { totalUnreadCount, refetchUnreadCounts: refetch };
};
