import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function useClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return format(currentTime, 'p');
}
