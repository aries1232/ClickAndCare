import React from 'react';
import ChatBox from '../Components/ChatBox.jsx';
import MyAppointmentsHeader from '../Components/appointments/MyAppointmentsHeader.jsx';
import AppointmentList from '../Components/appointments/AppointmentList.jsx';
import { useMyAppointments } from '../hooks/useMyAppointments';

const MyAppointment = () => {
  const {
    appointments, unreadCounts,
    chatOpen, chatAppointment, chatMessages, chatLoading,
    userData, socket,
    handlePaynow, cancelAppointment, handleOpenChat, closeChat,
    refreshAppointments,
  } = useMyAppointments();

  return (
    <div>
      <MyAppointmentsHeader />
      <AppointmentList
        appointments={appointments}
        unreadCounts={unreadCounts}
        onPay={handlePaynow}
        onCancel={cancelAppointment}
        onOpenChat={handleOpenChat}
        onExpire={refreshAppointments}
      />
      <ChatBox
        isOpen={chatOpen}
        onClose={closeChat}
        appointmentId={chatAppointment?._id}
        user={userData}
        doctor={chatAppointment?.docData}
        messages={chatMessages}
        loading={chatLoading}
        socket={socket}
      />
    </div>
  );
};

export default MyAppointment;
