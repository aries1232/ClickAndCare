import { MONTHS } from './constants';

export const slotDateFormat = (slotDate) => {
  if (!slotDate) return '';
  const [day, month, year] = slotDate.split('_');
  return ` ${day} ${MONTHS[Number(month)]} ${year}`;
};

export const calculateAge = (dob) => {
  if (!dob || dob === 'Not Selected') return 'N/A';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const formatLogDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const parseSlotDateTime = (slotDate, slotTime) => {
  if (!slotDate) return null;
  const [day, month, year] = slotDate.split('_').map(Number);
  const base = new Date(year, month - 1, day);
  if (slotTime) {
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(slotTime);
    if (match) {
      let h = Number(match[1]);
      const min = Number(match[2]);
      const suffix = match[3]?.toUpperCase();
      if (suffix === 'PM' && h !== 12) h += 12;
      if (suffix === 'AM' && h === 12) h = 0;
      base.setHours(h, min, 0, 0);
    }
  }
  return base;
};
