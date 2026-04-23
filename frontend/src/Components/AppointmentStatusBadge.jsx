import React from 'react';

const CLASSES = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

const AppointmentStatusBadge = ({ appointment }) => {
  if (appointment.cancelled) {
    return <span className={`${CLASSES} bg-red-100 text-red-800`}>Cancelled</span>;
  }
  if (appointment.isCompleted) {
    return <span className={`${CLASSES} bg-green-100 text-green-800`}>Completed</span>;
  }
  if (appointment.payment) {
    return <span className={`${CLASSES} bg-blue-100 text-blue-800`}>Confirmed</span>;
  }
  return <span className={`${CLASSES} bg-yellow-100 text-yellow-800`}>Pending Payment</span>;
};

export default AppointmentStatusBadge;
