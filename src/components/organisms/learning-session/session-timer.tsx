import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { useSession } from "./useSessionContext";

const SessionTimer = () => {
  const { time, phase, pause, resume, isRunning, handleCompleteSession } = useSession();

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && handleCompleteSession()}>
      <DialogContent>
        <DialogTitle>{phase === "breaking" ? "Break Time" : "Learning Time"}</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="text-4xl font-bold">{time}</div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={isRunning ? pause : resume}>
                {isRunning ? "Pause" : "Resume"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Stop</Button>
              </DialogClose>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimer;
