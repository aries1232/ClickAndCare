import { useEffect, useState } from 'react';
import { getBookedSlots } from '../services/doctorApi';

const DAYS = 7;
const DAY_START_HOUR = 10;
const DAY_END_HOUR = 20;
const SLOT_INTERVAL_MINUTES = 30;
const CUTOFF_HOUR = 19;
const CUTOFF_MINUTE = 30;

export const useSlotGeneration = (docInfo) => {
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  // Live booked slots from the backend (replaces the old doctor.slots_booked
  // denormalized map). Includes confirmed payments AND active soft locks.
  const [bookedSlots, setBookedSlots] = useState({});

  useEffect(() => {
    if (!docInfo?._id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getBookedSlots(docInfo._id);
        if (!cancelled && data.success) setBookedSlots(data.bookedSlots || {});
      } catch {
        if (!cancelled) setBookedSlots({});
      }
    })();
    return () => { cancelled = true; };
  }, [docInfo?._id]);

  useEffect(() => {
    if (!docInfo) return;

    const today = new Date();
    let nextDayShift = false;
    if (today.getHours() > CUTOFF_HOUR || (today.getHours() === CUTOFF_HOUR && today.getMinutes() > CUTOFF_MINUTE)) {
      today.setDate(today.getDate() + 1);
      nextDayShift = true;
    }

    const weekSlots = [];
    for (let i = 0; i < DAYS; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(DAY_END_HOUR, 0, 0, 0);

      if (nextDayShift) {
        currentDate.setHours(DAY_START_HOUR);
        currentDate.setMinutes(0);
      } else if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > DAY_START_HOUR ? currentDate.getHours() + 1 : DAY_START_HOUR);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(DAY_START_HOUR);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
        const isBooked = bookedSlots?.[slotDate]?.includes(formattedTime);
        if (!isBooked) {
          timeSlots.push({ dateTime: new Date(currentDate), time: formattedTime });
        }
        currentDate.setMinutes(currentDate.getMinutes() + SLOT_INTERVAL_MINUTES);
      }

      weekSlots.push(timeSlots);
    }

    setDocSlot(weekSlots);
  }, [docInfo, bookedSlots]);

  return { docSlot, slotIndex, setSlotIndex, slotTime, setSlotTime };
};
