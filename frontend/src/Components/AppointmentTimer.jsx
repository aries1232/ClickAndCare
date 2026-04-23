import React, { useEffect, useState } from 'react';
import { APPOINTMENT_PAYMENT_TIMEOUT_MS } from '../utils/constants';

const AppointmentTimer = ({ appointmentDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(appointmentDate).getTime();
      const expireTime = createdTime + APPOINTMENT_PAYMENT_TIMEOUT_MS;
      const difference = expireTime - Date.now();

      if (difference <= 0) {
        onExpire();
        return 0;
      }
      return difference;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [appointmentDate, onExpire]);

  if (timeLeft === null) return null;
  if (timeLeft <= 0) return <span className="text-red-500 font-bold">Expired</span>;

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="mt-2">
      <p className="text-red-500 text-sm font-medium animate-pulse">
        Complete payment in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
      <p className="text-xs text-red-400 mt-1">
        Appointment will be cancelled automatically if not paid.
      </p>
    </div>
  );
};

export default AppointmentTimer;
