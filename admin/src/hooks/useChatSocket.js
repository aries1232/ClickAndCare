import { useEffect, useRef, useState } from 'react';

/**
 * Shared chat-socket lifecycle for the doctor (and patient) chat panels.
 * Mirrors the patient-side hook so both ends use identical wire-up: join the
 * appointment room on open, listen for new messages + read/delivered receipts,
 * dispatch DOM events for the global unread-counts listener, and expose
 * sendText / sendImage helpers.
 *
 * `user` here is the *current* logged-in actor (doctor profile on the admin
 * app, user profile on the patient app). The peer is determined by who the
 * server marks as receiver.
 */
export const useChatSocket = ({ isOpen, appointmentId, socket, user, initialMessages }) => {
  const [liveMessages, setLiveMessages] = useState(initialMessages || []);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const currentUserId = user?._id || user?.id;
  const isOwn = (msg) => {
    if (!msg) return false;
    const sender = msg.sender ?? msg.senderId;
    if (!sender || !currentUserId) return false;
    return String(sender) === String(currentUserId);
  };

  const scrollToBottom = () => {
    setIsAutoScrolling(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setTimeout(() => setIsAutoScrolling(false), 500);
  };

  // Wire socket listeners while the chat panel is open.
  useEffect(() => {
    if (!isOpen || !appointmentId || !socket) return undefined;
    socket.emit('joinAppointmentRoom', appointmentId);

    const handleReceive = (msg) => {
      if (msg.appointmentId && String(msg.appointmentId) !== String(appointmentId)) return;
      setLiveMessages((prev) => {
        if (msg._id && prev.some((m) => String(m._id) === String(msg._id))) return prev;
        return [...prev, msg];
      });
      if (!isOwn(msg) && msg._id) {
        socket.emit('markMessageAsDelivered', { messageId: msg._id, appointmentId });
      }
      const container = messagesContainerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop - clientHeight < 80) {
          setIsAutoScrolling(true);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            setTimeout(() => setIsAutoScrolling(false), 500);
          }, 100);
        }
      }
    };

    const handleMessageDelivered = (data) => {
      setLiveMessages((prev) => prev.map((m) => (String(m._id) === String(data.messageId)
        ? { ...m, status: 'delivered', deliveredAt: data.deliveredAt }
        : m)));
    };
    const handleMessageRead = (data) => {
      setLiveMessages((prev) => prev.map((m) => (String(m._id) === String(data.messageId)
        ? { ...m, status: 'read', readAt: data.readAt }
        : m)));
    };
    const handleMessagesRead = (data) => {
      const ids = new Set((data.messageIds || []).map(String));
      setLiveMessages((prev) => prev.map((m) => (ids.has(String(m._id))
        ? { ...m, status: 'read', readAt: data.readAt }
        : m)));
    };
    const handleUnreadCountUpdate = (data) => {
      window.dispatchEvent(new CustomEvent('unreadCountUpdate', { detail: data }));
    };

    socket.on('receiveMessage', handleReceive);
    socket.on('messageDelivered', handleMessageDelivered);
    socket.on('messageRead', handleMessageRead);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('unreadCountUpdate', handleUnreadCountUpdate);

    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.off('messageDelivered', handleMessageDelivered);
      socket.off('messageRead', handleMessageRead);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('unreadCountUpdate', handleUnreadCountUpdate);
      // Leave the appointment room so events for *this* chat don't keep
      // arriving when we switch to a different conversation.
      if (appointmentId) socket.emit('leaveAppointmentRoom', appointmentId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, appointmentId, socket, currentUserId]);

  // Reset list when the open appointment changes.
  useEffect(() => {
    setLiveMessages(initialMessages || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // Merge late-arriving server snapshots without dropping socket-appended msgs.
  useEffect(() => {
    if (!initialMessages || !initialMessages.length) return;
    setLiveMessages((prev) => {
      const byId = new Map(prev.map((m) => [String(m._id), m]));
      initialMessages.forEach((m) => { if (m?._id) byId.set(String(m._id), m); });
      return Array.from(byId.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });
  }, [initialMessages]);

  // Track scroll position for the "jump to bottom" pill.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return undefined;
    const handleScroll = () => {
      if (isAutoScrolling) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight >= 80);
    };
    setTimeout(handleScroll, 200);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [liveMessages, isOpen, isAutoScrolling]);

  // Scroll to bottom when chat opens.
  useEffect(() => {
    if (!isOpen || !messagesEndRef.current) return;
    setIsAutoScrolling(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setTimeout(() => setIsAutoScrolling(false), 500);
    }, 150);
  }, [isOpen]);

  // Mark inbound unread messages as read when the chat is open.
  useEffect(() => {
    if (!isOpen || !socket || liveMessages.length === 0) return;
    const unread = liveMessages.filter((m) => !isOwn(m) && m.status !== 'read');
    if (unread.length === 0) return;
    socket.emit('markMessagesAsRead', {
      messageIds: unread.map((m) => m._id).filter(Boolean),
      appointmentId,
      userId: currentUserId,
    });
    window.dispatchEvent(new CustomEvent('resetUnreadCount', { detail: { appointmentId } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, socket, liveMessages, currentUserId, appointmentId]);

  // Reset unread count + (re)join room whenever the chat opens.
  useEffect(() => {
    if (!isOpen || !appointmentId || !socket) return;
    socket.emit('joinAppointmentRoom', appointmentId);
    socket.emit('resetUnreadCount', { appointmentId, userId: currentUserId });
    window.dispatchEvent(new CustomEvent('resetUnreadCount', { detail: { appointmentId } }));
  }, [isOpen, appointmentId, socket, currentUserId]);

  const sendText = (input) => {
    if (!input || !input.trim() || !socket) return;
    const msgObj = {
      sender: currentUserId,
      message: input,
      time: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString(),
    };
    socket.emit('sendMessage', { appointmentId, message: msgObj });
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };

  const sendImage = ({ fileUrl, fileName, fileSize, caption = '' }) => {
    if (!socket) return;
    const msgObj = {
      sender: currentUserId,
      message: caption,
      messageType: 'image',
      fileUrl, fileName, fileSize,
      time: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString(),
    };
    socket.emit('sendMessage', { appointmentId, message: msgObj });
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };

  return {
    liveMessages,
    showScrollButton,
    messagesEndRef,
    messagesContainerRef,
    scrollToBottom,
    sendText,
    sendImage,
    isOwn,
  };
};
