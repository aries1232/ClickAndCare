import React, { useState, useRef, useEffect } from 'react';
import MessageSkeleton from './MessageSkeleton';
import { useSocketContext } from '../context/SocketContext.jsx';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';

const SOCKET_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

function isDifferentDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() !== d2.toDateString();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  } else {
    // For messages older than 24 hours, show the actual time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

const ChatBox = ({ isOpen, onClose, appointmentId, user, doctor, messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const [liveMessages, setLiveMessages] = useState(messages || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [pendingMessages, setPendingMessages] = useState(new Set());
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { socket } = useSocketContext();

  // Join appointment room and listen for messages
  useEffect(() => {
    if (!isOpen || !appointmentId || !socket) return;
    socket.emit('joinAppointmentRoom', appointmentId);
    const handleReceive = (msg) => {
      setLiveMessages(prev => [...prev, msg]);
      
      // Mark message as delivered if it's not from the current user
      if (msg.sender !== user?._id && msg.sender !== user?.id) {
        console.log('ChatBox: Marking message as delivered:', msg._id, 'for appointment:', appointmentId);
        socket.emit('markMessageAsDelivered', { messageId: msg._id, appointmentId });
      }
      
      // Auto-scroll to bottom only if user is already at the bottom
      const container = messagesContainerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        if (isAtBottom) {
          // User is at bottom, auto-scroll to show new message
          setIsAutoScrolling(true);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            // Reset auto-scroll flag after animation completes
            setTimeout(() => {
              setIsAutoScrolling(false);
            }, 500);
          }, 100);
        }
        // If user is not at bottom, don't auto-scroll (they're reading older messages)
      }
    };
    socket.on('receiveMessage', handleReceive);

    // Handle message delivered status
    const handleMessageDelivered = (data) => {
      console.log('ChatBox: Message delivered event received:', data);
      setLiveMessages(prev => {
        const updated = prev.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, status: 'delivered', deliveredAt: data.deliveredAt }
            : msg
        );
        console.log('ChatBox: Updated messages after delivery:', updated.filter(msg => msg._id === data.messageId));
        return updated;
      });
    };

    // Handle message read status
    const handleMessageRead = (data) => {
      console.log('ChatBox: Message read event received:', data);
      setLiveMessages(prev => {
        const updated = prev.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, status: 'read', readAt: data.readAt }
            : msg
        );
        console.log('ChatBox: Updated messages after read:', updated.filter(msg => msg._id === data.messageId));
        return updated;
      });
    };

    // Handle multiple messages read status
    const handleMessagesRead = (data) => {
      console.log('ChatBox: Messages read:', data);
      setLiveMessages(prev => prev.map(msg => 
        data.messageIds.includes(msg._id)
          ? { ...msg, status: 'read', readAt: data.readAt }
          : msg
      ));
    };

    socket.on('messageDelivered', handleMessageDelivered);
    socket.on('messageRead', handleMessageRead);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('unreadCountUpdate', (data) => {
      console.log('ChatBox: Unread count update received:', data);
      // Dispatch custom event for parent components to handle
      window.dispatchEvent(new CustomEvent('unreadCountUpdate', { detail: data }));
    });

    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.off('messageDelivered', handleMessageDelivered);
      socket.off('messageRead', handleMessageRead);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('unreadCountUpdate');
    };
  }, [isOpen, appointmentId, socket]);

  // Reset messages when appointment changes
  useEffect(() => {
    setLiveMessages(messages || []);
  }, [messages, appointmentId]);

  // Check if user is near bottom to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Don't show arrow during auto-scroll operations
      if (isAutoScrolling) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // More lenient - show arrow only when recent message is not visible
      setShowScrollButton(!isAtBottom);
    };

    // Initial check with a small delay to ensure proper rendering
    setTimeout(() => {
      handleScroll();
    }, 200);
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [liveMessages, isOpen, isAutoScrolling]); // Re-run when messages change or chat opens

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      setIsAutoScrolling(true);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        setTimeout(() => {
          setIsAutoScrolling(false);
        }, 500);
      }, 150);
    }
  }, [isOpen]); // Only trigger when chat opens, not on every message

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && socket && liveMessages.length > 0) {
      // Get unread messages that were sent to the current user
      const unreadMessages = liveMessages.filter(msg => 
        (msg.sender !== user?._id && msg.sender !== user?.id) && 
        msg.status !== 'read'
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg._id);
        socket.emit('markMessagesAsRead', { 
          messageIds, 
          appointmentId, 
          userId: user?._id || user?.id 
        });
        console.log('ChatBox: Marking messages as read:', messageIds);
        
        // Also reset unread count immediately in frontend
        window.dispatchEvent(new CustomEvent('resetUnreadCount', {
          detail: { appointmentId }
        }));
      }
    }
  }, [isOpen, socket, liveMessages, user?._id, user?.id, appointmentId]);

  // Join appointment room and reset unread count when chat is opened
  useEffect(() => {
    if (isOpen && appointmentId && socket) {
      console.log('ChatBox: Joining appointment room:', appointmentId);
      socket.emit('joinAppointmentRoom', appointmentId);
      
      console.log('ChatBox: Resetting unread count for appointment:', appointmentId);
      // Reset unread count in database
      socket.emit('resetUnreadCount', { 
        appointmentId, 
        userId: user?._id || user?.id 
      });
      
      // Dispatch event to reset unread count in frontend
      window.dispatchEvent(new CustomEvent('resetUnreadCount', {
        detail: { appointmentId }
      }));
    }
  }, [isOpen, appointmentId, socket, user?._id, user?.id]);

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
    
    // Auto-scroll to bottom when sending a message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const scrollToBottom = () => {
    setIsAutoScrolling(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // Reset auto-scroll flag after animation completes
    setTimeout(() => {
      setIsAutoScrolling(false);
    }, 500);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${SOCKET_URL}/api/chat/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const msgObj = {
          sender: user?._id,
          message: input || '',
          messageType: 'image',
          fileUrl: response.data.fileUrl,
          fileName: response.data.fileName,
          fileSize: response.data.fileSize,
          time: new Date().toLocaleTimeString(),
          createdAt: new Date().toISOString(),
        };
        
        socket.emit('sendMessage', { appointmentId, message: msgObj });
        setInput('');
        
        // Auto-scroll to bottom when sending an image 
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // --- UI ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-100/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[80vh] min-h-[400px] relative border border-white/30 backdrop-blur-lg">
        {/* Scroll to bottom button */}
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
        {/* Header */}
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
        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-transparent">
          {loading ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : liveMessages && liveMessages.length > 0 ? (
            liveMessages.map((msg, idx) => {
              const isOwn = msg.sender === user?._id || msg.sender === user?.id;
              const showDateSeparator = idx === 0 || isDifferentDay(msg.createdAt, liveMessages[idx - 1]?.createdAt);
              
              return (
                <React.Fragment key={msg._id || idx}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full`}>
                    <div className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-md ${isOwn ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'} ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                      {/* Text message */}
                      {msg.message && <p className="text-sm lg:text-base select-none mb-2">{msg.message}</p>}
                      
                      {/* Image message */}
                      {msg.messageType === 'image' && msg.fileUrl && (
                        <div className="max-w-full relative group message-image mb-2">
                          <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                            <img 
                              src={msg.fileUrl} 
                              alt={msg.fileName || "Image"} 
                              className="w-full h-auto cursor-pointer transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
                              onClick={() => window.open(msg.fileUrl, '_blank')}
                            />
                            {/* Hover overlay */}
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
        {/* Input */}
        <form
          className="flex items-center gap-2 p-4 border-t border-white/20 bg-white/30 dark:bg-gray-900/60 rounded-b-2xl backdrop-blur-md"
          onSubmit={handleSend}
        >
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploadingImage}
            className="px-3 py-2 bg-gray-200/80 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-white"></div>
            ) : (
              <FaImage className="text-base lg:text-lg" />
            )}
          </button>
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
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

// Message Status Component for WhatsApp-like ticks
const MessageStatus = ({ status, fromMe }) => {
  if (!fromMe) return null; // Only show status for sent messages

  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "delivered":
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 text-white -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "read":
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 text-blue-400 drop-shadow-sm -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1 ml-2">
      {getStatusIcon()}
    </div>
  );
};

export default ChatBox; 