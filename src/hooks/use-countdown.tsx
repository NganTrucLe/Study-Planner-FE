import { useCallback, useEffect, useRef, useState } from "react";

function useCountdown(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  const endTimeRef = useRef(Date.now() + initialTime * 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
    setTimeLeft(timeLeft);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(updateTimer, 1000);
      updateTimer(); // Initial call to set the correct time immediately
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimer, isRunning]);

  const restart = useCallback(() => {
    endTimeRef.current = Date.now() + initialTime * 1000;
    setTimeLeft(initialTime);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return { time: formatTime(timeLeft), restart, stop, timeLeft };
}

export default useCountdown;
