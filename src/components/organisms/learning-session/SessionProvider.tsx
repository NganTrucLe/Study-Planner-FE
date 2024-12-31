import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { ToastAction } from "@/components/ui";
import { useGetSessions, useUpdateSession } from "@/hooks/react-query/useSessions";
import useCountdown from "@/hooks/use-countdown";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@/lib/types/session.type";
import { formatTime } from "@/lib/utils";

import SessionTimer from "./session-timer";
import { SessionContext } from "./useSessionContext";

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { data: sessions, isFetching } = useGetSessions();

  const [phase, setPhase] = useState<"learning" | "breaking" | "none">("none");
  const { time, isRunning, pause, resume, startCountdown, timeLeft } = useCountdown();

  const [createSessionDialog, setCreateSessionDialog] = useState(false);

  const [validSession, setValidSession] = useState<Session | undefined>();

  const audioRef = useMemo(
    () => new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3"),
    []
  );

  useEffect(() => {
    if (isFetching) console.log("Fetching sessions...");
  }, [isFetching]);

  const { outdatedSession } = useMemo<{
    outdatedSession: Session[];
  }>(() => {
    const filteredSessions = sessions?.filter((session) => session.status === "active");

    const outdated: Session[] = [];
    const valid: Session[] = [];

    for (const session of filteredSessions || []) {
      if (
        new Date(session.createdAt).getTime() / 1000 + session.duration + (session.break ?? 0) <
        new Date().getTime() / 1000
      ) {
        outdated.push(session);
      } else {
        valid.push(session);
      }
    }

    outdated.length && console.log("Outdated sessions", outdated);
    valid.length && console.log("Valid session", valid);

    valid.length && setValidSession(valid[0]);

    return { outdatedSession: outdated };
  }, [sessions]);

  const queryClient = useQueryClient();

  const { mutate: updateSession } = useUpdateSession(() => {
    let timeElapsed = 0;
    if (validSession)
      timeElapsed = Math.round(
        new Date().getTime() / 1000 - new Date(validSession.createdAt).getTime() / 1000
      );

    queryClient.invalidateQueries({ queryKey: ["sessions"] });

    toast({
      title: "Session completed",
      description: `Time elapsed: ${formatTime(timeElapsed)}.\nDo you want to start a new session?`,
      action: (
        <ToastAction onClick={() => setCreateSessionDialog(true)} altText="new session">
          New session
        </ToastAction>
      ),
    });
  });

  // Update the oudated session to completed
  useEffect(() => {
    for (const session of outdatedSession) {
      updateSession({
        _id: session._id,
        session: {
          status: "completed",
        },
      });
    }
  }, [outdatedSession, updateSession]);

  useEffect(() => {
    if (validSession && phase === "none") {
      console.log("[Session] There is a valid session", validSession);
      const currentTime = new Date().getTime();

      const learningEndTime =
        new Date(validSession.createdAt).getTime() + validSession.duration * 1000;
      const sessionEndTime = learningEndTime + (validSession.break ?? 0) * 1000;

      if (currentTime < learningEndTime) {
        setPhase("learning");
        startCountdown(Math.floor((learningEndTime - currentTime) / 1000));
      } else if (currentTime < sessionEndTime) {
        setPhase("breaking");
        startCountdown(Math.floor((sessionEndTime - currentTime) / 1000));
      }
    }
  }, [validSession, startCountdown, phase]);

  useEffect(() => {
    console.log("[Session] Phase changed to", phase);
  }, [phase]);

  const handleCompleteSession = useCallback(() => {
    if (validSession?._id) {
      updateSession({
        _id: validSession._id,
        session: {
          status: "completed",
        },
      });
      audioRef.play();
      setValidSession(undefined);
      setPhase("none");
    }
  }, [updateSession, validSession, audioRef]);

  useEffect(() => {
    if (timeLeft === 0 && validSession && phase !== "none") {
      console.log("[Session] Countdown completed", phase, validSession);
      if (phase === "learning" && validSession.break) {
        console.log("[Session] Starting break time");
        setPhase("breaking");
        startCountdown(validSession.break);
        return;
      }
      handleCompleteSession();
    }
  }, [phase, startCountdown, validSession, updateSession, timeLeft, handleCompleteSession]);

  return (
    <SessionContext.Provider
      value={{
        isRunning,
        phase,
        time,
        pause,
        resume,
        session: validSession,
        createSessionDialog,
        setCreateSessionDialog,
        handleCompleteSession,
      }}
    >
      {children}
      {validSession && <SessionTimer />}
    </SessionContext.Provider>
  );
};