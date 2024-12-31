import { useCallback, useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/utils";

function useCountdown(initialTime: number = 0) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const endTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
    setTimeLeft(remaining);
    if (remaining === 0) {
      setIsRunning(false);
    }
  }, [setTimeLeft, setIsRunning]);

  const restart = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeLeft(initialTime);
    setIsRunning(true);
    intervalRef.current = setInterval(updateTimer, 1000);
    endTimeRef.current = Date.now() + initialTime * 1000;
  }, [initialTime, updateTimer]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(updateTimer, 1000);
      updateTimer();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updateTimer, isRunning]);

  const startCountdown = useCallback((durationInSeconds: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    endTimeRef.current = Date.now() + durationInSeconds * 1000;
    setTimeLeft(durationInSeconds);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    console.log("[Countdown] Countdown paused");
  }, [setIsRunning]);

  const resume = useCallback(() => {
    if (timeLeft <= 0) return;
    endTimeRef.current = Date.now() + timeLeft * 1000;
    setIsRunning(true);
    console.log("[Countdown] Countdown resumed");
  }, [timeLeft, setIsRunning]);

  return {
    time: formatTime(timeLeft),
    timeLeft,
    isRunning,
    startCountdown,
    pause,
    resume,
    restart,
  };
}

export default useCountdown;
