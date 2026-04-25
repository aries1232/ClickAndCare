import React from 'react';

const Badge = ({ tone, label, dotPulse = false }) => {
  const tones = {
    red: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
    blue: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
    yellow: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  };
  const dotColors = {
    red: 'bg-red-500',
    green: 'bg-emerald-500',
    blue: 'bg-sky-500',
    yellow: 'bg-amber-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 flex-shrink-0 ${tones[tone]}`}>
      <span className="relative flex h-2 w-2">
        {dotPulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[tone]} opacity-60`} />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[tone]}`} />
      </span>
      {label}
    </span>
  );
};

const AppointmentStatusBadge = ({ appointment }) => {
  if (appointment.cancelled) return <Badge tone="red" label="Cancelled" />;
  if (appointment.isCompleted) return <Badge tone="green" label="Completed" />;
  if (appointment.payment) return <Badge tone="blue" label="Confirmed" dotPulse />;
  return <Badge tone="yellow" label="Pending Payment" dotPulse />;
};

export default AppointmentStatusBadge;
