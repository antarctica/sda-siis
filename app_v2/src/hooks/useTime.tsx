import { now } from '@internationalized/date';
import React from 'react';
import { useInterval } from 'usehooks-ts';

function useTime(refreshCycle = 1000) {
  const [time, setTime] = React.useState(() => now('UTC'));

  useInterval(() => {
    setTime(now('UTC'));
  }, refreshCycle);

  // Sync with system clock on first render
  React.useEffect(() => {
    const currentTime = now('UTC');
    const timeToNextSecond = 1000 - currentTime.millisecond;
    const timer = setTimeout(() => {
      setTime(now('UTC'));
    }, timeToNextSecond);

    return () => clearTimeout(timer);
  }, []);

  return time;
}

export default useTime;
