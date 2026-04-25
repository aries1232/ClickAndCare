import React from 'react';
import AppointmentCard from './AppointmentCard.jsx';
import EmptyAppointments from './EmptyAppointments.jsx';

const AppointmentList = ({ appointments, unreadCounts, onCancel, onOpenChat, filter, totalCount }) => {
  if (appointments.length === 0) {
    // If totalCount is 0, the user has no appointments at all → "browse doctors"
    // empty state. If totalCount > 0 but filtered list is empty → "no matches in
    // this filter".
    return <EmptyAppointments hasNone={totalCount === 0} filter={filter} />;
  }
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
