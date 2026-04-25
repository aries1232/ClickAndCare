import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import MessageSkeleton from './MessageSkeleton';
import { useSocketContext } from '../context/SocketContext.jsx';
import { useChatSocket } from '../hooks/useChatSocket';
import { useChatImageUpload } from '../hooks/useChatImageUpload';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const isDifferentDay = (a, b) => {
  if (!a || !b) return false;
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
  return d1.toDateString() !== d2.toDateString();
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageStatus = ({ status, fromMe }) => {
  if (!fromMe) return null;
  const tickClass = status === 'read' ? 'text-blue-300' : 'text-white';
  if (status === 'sent') {
    return (
      <svg className={`w-3.5 h-3.5 ${tickClass}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <span className="flex">
      <svg className={`w-3.5 h-3.5 ${tickClass}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <svg className={`w-3.5 h-3.5 ${tickClass} -ml-1.5`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
  );
};

const ChatBox = ({ isOpen, onClose, appointmentId, user, doctor, messages, loading }) => {
  const { socket, onlineUsers } = useSocketContext() || {};

  const chat = useChatSocket({ isOpen, appointmentId, socket, user, initialMessages: messages });
  const upload = useChatImageUpload({
    onUploaded: ({ fileUrl, fileName, fileSize }) => chat.sendImage({ fileUrl, fileName, fileSize }),
  });

  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    chat.sendText(input);
    setInput('');
  };

  const peer = doctor || user;
  const peerId = peer?._id || peer?.id;
  const isOnline = peerId && Array.isArray(onlineUsers) && onlineUsers.includes(String(peerId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[80vh] min-h-[400px] relative ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
        {chat.showScrollButton && (
          <button
            onClick={chat.scrollToBottom}
            className="absolute bottom-20 right-4 z-20 w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={peer?.image}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-800" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{peer?.name}</p>
              <p className={`text-[11px] font-medium flex items-center gap-1 ${
                isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'}`} />
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div ref={chat.messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-1 bg-gray-50 dark:bg-gray-900/40">
          {loading ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : chat.liveMessages.length > 0 ? (
            chat.liveMessages.map((msg, idx) => {
              const own = chat.isOwn(msg);
              const showDateSeparator = idx === 0 || isDifferentDay(msg.createdAt, chat.liveMessages[idx - 1]?.createdAt);
              return (
                <React.Fragment key={msg._id || idx}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-3">
                      <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[11px] font-medium px-3 py-1 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm">
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                  )}
                  <div className={`flex ${own ? 'justify-end' : 'justify-start'} w-full py-0.5`}>
                    <div className={`px-3.5 py-2 max-w-[75%] break-words ${
                      own
                        ? 'bg-primary !text-white rounded-2xl rounded-br-sm shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm ring-1 ring-gray-200 dark:ring-gray-600 shadow-sm'
                    }`}>
                      {msg.messageType === 'image' && msg.fileUrl && (
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName || ''}
                          className="max-w-full h-auto rounded-xl ring-1 ring-black/5 cursor-pointer mb-1"
                          onClick={() => window.open(msg.fileUrl, '_blank')}
                        />
                      )}
                      {msg.message && <p className={`text-sm leading-snug ${own ? '!text-white' : ''}`}>{msg.message}</p>}
                      <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        own ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        <span>{formatTime(msg.createdAt)}</span>
                        <MessageStatus status={msg.status} fromMe={own} />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="font-semibold text-gray-700 dark:text-gray-200">No messages yet</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Send a message to start the conversation.</p>
            </div>
          )}
          <div ref={chat.messagesEndRef} />
        </div>

        {/* Composer */}
        <form
          className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            onClick={upload.openPicker}
            disabled={upload.uploading}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Attach image"
          >
            {upload.uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-primary" />
            ) : (
              <FaImage className="w-4 h-4" />
            )}
          </button>

          <input ref={upload.fileInputRef} type="file" accept="image/*" className="hidden" onChange={upload.handleFileSelect} />

          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-colors"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className={`flex-shrink-0 px-4 h-10 rounded-full font-semibold text-sm transition-all duration-200 ${
              input.trim()
                ? 'bg-primary !text-white shadow-md hover:bg-emerald-500 active:scale-95'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
