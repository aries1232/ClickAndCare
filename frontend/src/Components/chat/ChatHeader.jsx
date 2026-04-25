import React from 'react';
import { HiX } from 'react-icons/hi';
import { useSocketContext } from '../../context/SocketContext.jsx';

const ChatHeader = ({ user, doctor, onClose }) => {
  const peer = doctor || user;
  const { onlineUsers } = useSocketContext() || {};
  const peerId = peer?._id || peer?.id;
  const isOnline = peerId && Array.isArray(onlineUsers) && onlineUsers.includes(peerId);

  return (
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
          <p
            className={`text-[11px] font-medium flex items-center gap-1 ${
              isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'
              }`}
            />
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close chat"
      >
        <HiX className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
