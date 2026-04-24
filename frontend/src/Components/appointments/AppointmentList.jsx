import React from 'react';
import AppointmentCard from './AppointmentCard.jsx';
import EmptyAppointments from './EmptyAppointments.jsx';

const AppointmentList = ({ appointments, unreadCounts, onCancel, onOpenChat }) => {
  if (appointments.length === 0) return <EmptyAppointments />;
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          unreadCount={unreadCounts[appointment._id]}
          onCancel={onCancel}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  );
};

export default AppointmentList;
