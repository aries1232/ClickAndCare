import React from 'react';
import ChatBox from '../Components/ChatBox.jsx';
import MyAppointmentsHeader from '../Components/appointments/MyAppointmentsHeader.jsx';
import AppointmentList from '../Components/appointments/AppointmentList.jsx';
import { useMyAppointments } from '../hooks/useMyAppointments';

const MyAppointment = () => {
  const {
    appointments, unreadCounts,
    chatOpen, chatAppointment, chatMessages, chatLoading,
    chatHasMoreOlder, chatLoadingOlder, loadOlderMessages,
    userData, socket,
    handlePaynow, cancelAppointment, handleOpenChat, closeChat,
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
