import React from 'react';
import RelatedDoctors from '../Components/RelatedDoctors.jsx';
import DoctorHeader from '../Components/appointment/DoctorHeader.jsx';
import SlotPicker from '../Components/appointment/SlotPicker.jsx';
import { useAppointmentBooking } from '../hooks/useAppointmentBooking';

const Appointment = () => {
  const booking = useAppointmentBooking();

  if (!booking.docInfo) return null;

  return (
    <div>
      <DoctorHeader docInfo={booking.docInfo} />
      <SlotPicker
        docSlot={booking.docSlot}
        slotIndex={booking.slotIndex}
        setSlotIndex={booking.setSlotIndex}
        slotTime={booking.slotTime}
        setSlotTime={booking.setSlotTime}
        isBooking={booking.isBooking}
        onBook={booking.bookAppointment}
      />
      <RelatedDoctors docId={booking.docId} speciality={booking.docInfo.speciality} />
    </div>
  );
};

export default Appointment;
