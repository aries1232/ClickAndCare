import { useEffect, useRef, useState } from 'react';
import { OTP_RESEND_SECONDS } from '../utils/constants';

export const useOtpCountdown = (initialSeconds = OTP_RESEND_SECONDS) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = (from = initialSeconds) => {
    clear();
    setSeconds(from);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clear(), []);

  return { seconds, start, reset: clear, isActive: seconds > 0 };
};
