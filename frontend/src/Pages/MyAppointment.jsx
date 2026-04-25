import React, { useMemo, useState } from 'react';
import ChatBox from '../Components/ChatBox.jsx';
import MyAppointmentsHeader from '../Components/appointments/MyAppointmentsHeader.jsx';
import AppointmentList from '../Components/appointments/AppointmentList.jsx';
import { useMyAppointments } from '../hooks/useMyAppointments';

const matchesFilter = (a, filter) => {
  if (filter === 'all') return true;
  if (filter === 'cancelled') return !!a.cancelled;
  if (filter === 'completed') return !!a.isCompleted && !a.cancelled;
  if (filter === 'active') return !a.cancelled && !a.isCompleted;
  return true;
};

const MyAppointment = () => {
  const {
    appointments, unreadCounts,
    chatOpen, chatAppointment, chatMessages, chatLoading,
    chatHasMoreOlder, chatLoadingOlder, loadOlderMessages,
    userData, socket,
    cancelAppointment, handleOpenChat, closeChat,
  } = useMyAppointments();

  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => ({
    all: appointments.length,
    active: appointments.filter((a) => !a.cancelled && !a.isCompleted).length,
    completed: appointments.filter((a) => a.isCompleted && !a.cancelled).length,
    cancelled: appointments.filter((a) => a.cancelled).length,
  }), [appointments]);

  const filtered = useMemo(
    () => appointments.filter((a) => matchesFilter(a, filter)),
    [appointments, filter]
  );

  return (
    <div className="pb-16">
      <MyAppointmentsHeader counts={counts} filter={filter} setFilter={setFilter} />
      <AppointmentList
        appointments={filtered}
        unreadCounts={unreadCounts}
        onCancel={cancelAppointment}
        onOpenChat={handleOpenChat}
        filter={filter}
        totalCount={appointments.length}
      />
      <ChatBox
        isOpen={chatOpen}
        onClose={closeChat}
        appointmentId={chatAppointment?._id}
        user={userData}
        doctor={chatAppointment?.docData}
        messages={chatMessages}
        loading={chatLoading}
        hasMoreOlder={chatHasMoreOlder}
        loadingOlder={chatLoadingOlder}
        onLoadOlder={loadOlderMessages}
        socket={socket}
      />
    </div>
  );
};

export default MyAppointment;
