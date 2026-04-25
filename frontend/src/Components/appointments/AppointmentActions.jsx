import React from 'react';
import { HiOutlineChatAlt2, HiOutlineXCircle, HiOutlineCheckCircle, HiOutlineBan } from 'react-icons/hi';
import ReceiptButton from './ReceiptButton.jsx';

const UnreadBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center font-bold ring-2 ring-white dark:ring-gray-800">
      {count > 99 ? '99+' : count}
    </span>
  );
};

const StatusPill = ({ icon: Icon, label, tone }) => {
  const toneCls = tone === 'completed'
    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-500/20'
    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 ring-red-200/60 dark:ring-red-500/20';
  return (
    <div className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ring-1 ${toneCls}`}>
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
};

const AppointmentActions = ({ appointment, unreadCount, onCancel, onOpenChat }) => {
  if (appointment.payment && !appointment.isCompleted && !appointment.cancelled) {
    return (
      <>
        <button
          type="button"
          onClick={() => onOpenChat(appointment)}
          className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary !text-white text-sm font-semibold shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200"
        >
          <HiOutlineChatAlt2 className="w-4 h-4" />
          Chat with Doctor
          <UnreadBadge count={unreadCount} />
        </button>
        <ReceiptButton appointmentId={appointment._id} />
        <button
          type="button"
          onClick={() => onCancel(appointment._id)}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-full ring-1 ring-gray-300 dark:ring-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:ring-red-300 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:ring-red-400/40 dark:hover:text-red-300 transition-all duration-200"
        >
          <HiOutlineXCircle className="w-4 h-4" />
          Cancel
        </button>
      </>
    );
  }

  if (appointment.isCompleted) {
    return (
      <>
        <StatusPill icon={HiOutlineCheckCircle} label="Appointment Completed" tone="completed" />
        {appointment.payment && <ReceiptButton appointmentId={appointment._id} />}
      </>
    );
  }

  if (appointment.cancelled) {
    return (
      <>
        <StatusPill icon={HiOutlineBan} label="Appointment Cancelled" tone="cancelled" />
        {appointment.payment && <ReceiptButton appointmentId={appointment._id} />}
      </>
    );
  }

  return null;
};

export default AppointmentActions;
