import React from 'react';

const ChatIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const UnreadBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
};

const AppointmentActions = ({ appointment, unreadCount, onCancel, onOpenChat }) => {
  if (appointment.payment && !appointment.isCompleted && !appointment.cancelled) {
    return (
      <>
        <button
          className="relative inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl sm:min-w-48"
          onClick={() => onOpenChat(appointment)}
        >
          <ChatIcon />
          Chat
          <UnreadBadge count={unreadCount} />
        </button>
        <button
          className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
          onClick={() => onCancel(appointment._id)}
        >
          Cancel Appointment
        </button>
      </>
    );
  }

  if (appointment.isCompleted) {
    return <button className="sm:min-w-48 py-2 border border-gray-400 rounded text-gray-500">Appointment Completed</button>;
  }

  if (appointment.cancelled) {
    return <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancelled</button>;
  }

  return null;
};

export default AppointmentActions;
