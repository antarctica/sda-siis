import React from 'react';
import { useInterval } from 'usehooks-ts';

function useTime(refreshCycle = 1000) {
  const [time, setTime] = React.useState(new Date());

  useInterval(() => {
    setTime(new Date());
  }, refreshCycle);

  // Sync with system clock on first render
  React.useEffect(() => {
    const now = new Date();
    const timeToNextSecond = 1000 - now.getMilliseconds();
    const timer = setTimeout(() => {
      setTime(new Date());
    }, timeToNextSecond);

    return () => clearTimeout(timer);
  }, []);

  return time;
}

export default useTime;
