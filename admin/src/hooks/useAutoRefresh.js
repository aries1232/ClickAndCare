import { useEffect, useRef } from 'react';

/**
 * Starts periodic timers for a list of { fn, ms } pairs while `enabled` is truthy.
 * Each timer is independent. Timers are cleared on teardown or when `enabled` becomes falsy.
 */
export const useAutoRefresh = (jobs, enabled) => {
  const timersRef = useRef([]);

  useEffect(() => {
    if (!enabled) return undefined;
    timersRef.current = jobs.map(({ fn, ms }) => setInterval(fn, ms));
    return () => {
      timersRef.current.forEach(clearInterval);
      timersRef.current = [];
    };
  }, [enabled, jobs]);
};
