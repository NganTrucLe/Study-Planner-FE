import { useCallback, useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/utils";

function useCountdown(initialTime: number = 0) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const endTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    setTimeLeft(remaining);
    if (remaining === 0) {
      setIsRunning(false);
    }
  }, [setTimeLeft, setIsRunning]);

  const restart = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeLeft(initialTime);
    setIsRunning(true);
    intervalRef.current = setInterval(updateTimer, 1000);
    endTimeRef.current = Date.now() + initialTime * 1000;
  }, [initialTime, updateTimer]);

  useEffect(() => {
    if (isRunning && !intervalRef.current) {
      intervalRef.current = setInterval(updateTimer, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateTimer, isRunning]);

  const startCountdown = useCallback(
    (durationInSeconds: number) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTimeLeft(durationInSeconds);
      setIsRunning(true);
      endTimeRef.current = Date.now() + durationInSeconds * 1000;
      intervalRef.current = setInterval(updateTimer, 1000);
    },
    [updateTimer]
  );

  const stop = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log("[Countdown] Countdown stopped");
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log("[Countdown] Countdown paused");
  }, []);

  const resume = useCallback(() => {
    if (timeLeft <= 0) return;
    endTimeRef.current = Date.now() + timeLeft * 1000;
    setIsRunning(true);
    console.log("[Countdown] Countdown resumed");
  }, [timeLeft]);

  return {
    time: formatTime(timeLeft),
    timeLeft,
    isRunning,
    startCountdown,
    stop,
    pause,
    resume,
    restart,
  };
}

export default useCountdown;
