import { useCallback, useEffect, useRef, useState } from "react";

function useCountdown(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const endTimeRef = useRef(Date.now() + initialTime * 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
    setTimeLeft(timeLeft);
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(updateTimer, 1000);
      updateTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimer, isRunning, isPaused]);

  const restart = useCallback(() => {
    endTimeRef.current = Date.now() + initialTime * 1000;
    setTimeLeft(initialTime);
    setIsRunning(true);
    setIsPaused(false);
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    endTimeRef.current = Date.now() + timeLeft * 1000;
  }, [timeLeft]);

  const setTime = useCallback((newTime: number) => {
    setTimeLeft(newTime);
    endTimeRef.current = Date.now() + newTime * 1000;
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return { time: formatTime(timeLeft), restart, stop, pause, resume, timeLeft, setTime };
}

export default useCountdown;
