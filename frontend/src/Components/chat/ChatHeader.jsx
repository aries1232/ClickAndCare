import React from 'react';

const ChatHeader = ({ user, doctor, onClose }) => (
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
);

export default ChatHeader;
