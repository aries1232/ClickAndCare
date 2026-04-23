import { useEffect, useRef, useState } from 'react';

export const useChatSocket = ({ isOpen, appointmentId, socket, user, initialMessages }) => {
  const [liveMessages, setLiveMessages] = useState(initialMessages || []);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const currentUserId = user?._id || user?.id;
  const isOwn = (msg) => msg.sender === user?._id || msg.sender === user?.id;

  const scrollToBottom = () => {
    setIsAutoScrolling(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setTimeout(() => setIsAutoScrolling(false), 500);
  };

  // Socket listeners
  useEffect(() => {
    if (!isOpen || !appointmentId || !socket) return;
    socket.emit('joinAppointmentRoom', appointmentId);

    const handleReceive = (msg) => {
      setLiveMessages((prev) => [...prev, msg]);
      if (msg.sender !== user?._id && msg.sender !== user?.id) {
        socket.emit('markMessageAsDelivered', { messageId: msg._id, appointmentId });
      }
      const container = messagesContainerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop - clientHeight < 50) {
          setIsAutoScrolling(true);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            setTimeout(() => setIsAutoScrolling(false), 500);
          }, 100);
        }
      }
    };

    const handleMessageDelivered = (data) => {
      setLiveMessages((prev) => prev.map((msg) => msg._id === data.messageId ? { ...msg, status: 'delivered', deliveredAt: data.deliveredAt } : msg));
    };
    const handleMessageRead = (data) => {
      setLiveMessages((prev) => prev.map((msg) => msg._id === data.messageId ? { ...msg, status: 'read', readAt: data.readAt } : msg));
    };
    const handleMessagesRead = (data) => {
      setLiveMessages((prev) => prev.map((msg) => data.messageIds.includes(msg._id) ? { ...msg, status: 'read', readAt: data.readAt } : msg));
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
    };
  }, [isOpen, appointmentId, socket]);

  // On appointment change: reset the live list to whatever the parent has.
  useEffect(() => {
    setLiveMessages(initialMessages || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // When the parent pushes a new snapshot for the SAME appointment (older page
  // loaded, refetch, etc.), merge by _id so we don't drop socket-appended
  // messages that haven't been written back to the parent yet.
  useEffect(() => {
    if (!initialMessages || !initialMessages.length) return;
    setLiveMessages((prev) => {
      const byId = new Map(prev.map((m) => [String(m._id), m]));
      initialMessages.forEach((m) => { if (m?._id) byId.set(String(m._id), m); });
      return Array.from(byId.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });
  }, [initialMessages]);

  // Track scroll position for "jump to bottom" button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isAutoScrolling) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight >= 50);
    };

    setTimeout(handleScroll, 200);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [liveMessages, isOpen, isAutoScrolling]);

  // Scroll to bottom on open
  useEffect(() => {
    if (!isOpen || !messagesEndRef.current) return;
    setIsAutoScrolling(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setTimeout(() => setIsAutoScrolling(false), 500);
    }, 150);
  }, [isOpen]);

  // Mark incoming messages as read when chat opens
  useEffect(() => {
    if (!isOpen || !socket || liveMessages.length === 0) return;
    const unread = liveMessages.filter((msg) => !isOwn(msg) && msg.status !== 'read');
    if (unread.length === 0) return;
    socket.emit('markMessagesAsRead', {
      messageIds: unread.map((m) => m._id),
      appointmentId,
      userId: currentUserId,
    });
    window.dispatchEvent(new CustomEvent('resetUnreadCount', { detail: { appointmentId } }));
  }, [isOpen, socket, liveMessages, currentUserId, appointmentId]);

  // Reset unread count on server when chat opens
  useEffect(() => {
    if (!isOpen || !appointmentId || !socket) return;
    socket.emit('joinAppointmentRoom', appointmentId);
    socket.emit('resetUnreadCount', { appointmentId, userId: currentUserId });
    window.dispatchEvent(new CustomEvent('resetUnreadCount', { detail: { appointmentId } }));
  }, [isOpen, appointmentId, socket, currentUserId]);

  const sendText = (input) => {
    if (!input.trim() || !socket) return;
    const msgObj = {
      sender: user?._id,
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
      sender: user?._id,
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
