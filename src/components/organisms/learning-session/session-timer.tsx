import { useEffect } from "react";
import useCountdown from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useAuthStore } from "@/hooks/useAuthStore";

const SessionTimer = () => {
  const {} = useAuthStore();
  const { session, state, learningState, setPause, setResume, setBreak, setStop } =
    useSessionStore();
  const { time, pause, resume, timeLeft, setTime } = useCountdown(session.duration);

  useEffect(() => {
    if (timeLeft === 0) {
      if (learningState === "learning") {
        setBreak();
        setTime(session.break);
      } else {
        setStop();
      }
    }
  }, [timeLeft, learningState, setBreak, setStop, session.break, setTime]);

  const handlePause = () => {
    if (state !== "paused") {
      pause();
      setPause();
    } else {
      resume();
      setResume();
    }
  };

  const handleEndSession = () => {
    console.log("End");
  };

  return (
    <Dialog open={state !== "idle"}>
      <DialogContent>
        <DialogTitle>{learningState === "breaking" ? "Break Time" : "Focus Time"}</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="text-4xl font-bold">{time}</div>
            <div className="flex gap-2">
              <Button onClick={handlePause}>{state === "paused" ? "Start" : "Pause"}</Button>
              <Button variant="outline" onClick={handleEndSession}>
                End Session
              </Button>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimer;
