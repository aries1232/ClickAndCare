import { MONTHS } from './constants';

export const slotDateFormat = (slotDate) => {
  if (!slotDate) return '';
  const [day, month, year] = slotDate.split('_');
  return ` ${day} ${MONTHS[Number(month)]} ${year}`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const isDifferentDay = (date1, date2) => {
  return new Date(date1).toDateString() !== new Date(date2).toDateString();
};

export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
