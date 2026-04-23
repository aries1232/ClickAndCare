import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import MessageSkeleton from './MessageSkeleton';
import MessageStatus from './MessageStatus.jsx';
import { useSocketContext } from '../context/SocketContext.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { uploadChatImage } from '../services/chatApi';
import { validateImageFile } from '../utils/validators';
import { formatDate, formatTime, isDifferentDay } from '../utils/dateUtils';

const ChatBox = ({ isOpen, onClose, appointmentId, user, doctor, messages, onSendMessage, loading }) => {
  const { backendUrl } = useContext(AppContext);
  const { socket } = useSocketContext();

  const [input, setInput] = useState('');
  const [liveMessages, setLiveMessages] = useState(messages || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUserId = user?._id || user?.id;
  const isOwnMessage = (msg) => msg.sender === user?._id || msg.sender === user?.id;

  const scrollToBottom = () => {
    setIsAutoScrolling(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setTimeout(() => setIsAutoScrolling(false), 500);
  };

  // Socket listeners: join room + message events
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
      setLiveMessages((prev) =>
        prev.map((msg) => msg._id === data.messageId ? { ...msg, status: 'delivered', deliveredAt: data.deliveredAt } : msg)
      );
    };

    const handleMessageRead = (data) => {
      setLiveMessages((prev) =>
        prev.map((msg) => msg._id === data.messageId ? { ...msg, status: 'read', readAt: data.readAt } : msg)
      );
    };

    const handleMessagesRead = (data) => {
      setLiveMessages((prev) =>
        prev.map((msg) => data.messageIds.includes(msg._id) ? { ...msg, status: 'read', readAt: data.readAt } : msg)
      );
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

  useEffect(() => {
    setLiveMessages(messages || []);
  }, [messages, appointmentId]);

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

    const unreadMessages = liveMessages.filter(
      (msg) => !isOwnMessage(msg) && msg.status !== 'read'
    );
    if (unreadMessages.length === 0) return;

    socket.emit('markMessagesAsRead', {
      messageIds: unreadMessages.map((m) => m._id),
      appointmentId,
      userId: currentUserId,
    });

    window.dispatchEvent(new CustomEvent('resetUnreadCount', { detail: { appointmentId } }));
  }, [isOpen, socket, liveMessages, currentUserId, appointmentId]);

  // Reset unread count on the server when chat opens
  useEffect(() => {
    if (!isOpen || !appointmentId || !socket) return;
    socket.emit('joinAppointmentRoom', appointmentId);
    socket.emit('resetUnreadCount', { appointmentId, userId: currentUserId });
    window.dispatchEvent(new CustomEvent('resetUnreadCount', { detail: { appointmentId } }));
  }, [isOpen, appointmentId, socket, currentUserId]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgObj = {
      sender: user?._id,
      message: input,
      time: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString(),
    };

    socket.emit('sendMessage', { appointmentId, message: msgObj });
    if (onSendMessage) onSendMessage(input);
    setInput('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const data = await uploadChatImage(backendUrl, file);
      if (data.success) {
        const msgObj = {
          sender: user?._id,
          message: input || '',
          messageType: 'image',
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          time: new Date().toLocaleTimeString(),
          createdAt: new Date().toISOString(),
        };
        socket.emit('sendMessage', { appointmentId, message: msgObj });
        setInput('');
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-100/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[80vh] min-h-[400px] relative border border-white/30 backdrop-blur-lg">
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 p-2 bg-gray-800/90 hover:bg-gray-700/90 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            title="Scroll to bottom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/30 dark:bg-gray-900/60 rounded-t-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img src={doctor?.image || user?.image} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow" />
            <div>
              <div className="text-gray-900 dark:text-white font-semibold">{doctor?.name || user?.name}</div>
              <div className="text-blue-700 dark:text-blue-200 text-xs">Appointment Chat</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-700 dark:text-white hover:text-red-500 text-3xl font-bold px-3 py-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200">&times;</button>
        </div>

        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-transparent">
          {loading ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : liveMessages.length > 0 ? (
            liveMessages.map((msg, idx) => {
              const isOwn = isOwnMessage(msg);
              const showDateSeparator = idx === 0 || isDifferentDay(msg.createdAt, liveMessages[idx - 1]?.createdAt);

              return (
                <React.Fragment key={msg._id || idx}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                  )}

                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full`}>
                    <div className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-md ${isOwn ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'}`}>
                      {msg.message && <p className="text-sm lg:text-base select-none mb-2">{msg.message}</p>}

                      {msg.messageType === 'image' && msg.fileUrl && (
                        <div className="max-w-full relative group message-image mb-2">
                          <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                            <img
                              src={msg.fileUrl}
                              alt={msg.fileName || 'Image'}
                              className="w-full h-auto cursor-pointer transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
                              onClick={() => window.open(msg.fileUrl, '_blank')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-right mt-1 opacity-60 flex items-center justify-end gap-1">
                        <span>{formatTime(msg.createdAt)}</span>
                        <MessageStatus status={msg.status} fromMe={isOwn} />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="text-center text-gray-400">No messages yet. Start the conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="flex items-center gap-2 p-4 border-t border-white/20 bg-white/30 dark:bg-gray-900/60 rounded-b-2xl backdrop-blur-md"
          onSubmit={handleSend}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="px-3 py-2 bg-gray-200/80 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-white"></div>
            ) : (
              <FaImage className="text-base lg:text-lg" />
            )}
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
