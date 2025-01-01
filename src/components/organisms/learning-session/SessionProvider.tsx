import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { ToastAction } from "@/components/ui";
import { useGetSessions, useUpdateSession } from "@/hooks/react-query/useSessions";
import useCountdown from "@/hooks/use-countdown";
import { useToast } from "@/hooks/use-toast";
import { EnumSessionPhase, EnumSessionStatus } from "@/lib/enums";
import { Session } from "@/lib/types/session.type";

import SessionTimer from "./session-timer";
import { SessionContext } from "./useSessionContext";

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { toast, dismiss } = useToast();
  const { data: sessions } = useGetSessions({
    status: [EnumSessionStatus.ACTIVE],
  });

  const [phase, setPhase] = useState<EnumSessionPhase>(EnumSessionPhase.NONE);
  const { time, isRunning, pause, resume, startCountdown, timeLeft } = useCountdown();

  const [createSessionDialog, setCreateSessionDialog] = useState(false);

  const [validSession, setValidSession] = useState<Session | undefined>();

  const audioRef = useMemo(
    () => new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3"),
    []
  );

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

  const { mutate: updateSession } = useUpdateSession((_, variables) => {
    queryClient.invalidateQueries({ queryKey: ["sessions"] });

    if (variables?.session?.status === EnumSessionStatus.COMPLETED)
      toast({
        title: "Session completed",
        description: `Do you want to start a new session?`,
        action: (
          <div className="flex flex-col gap-1">
            <ToastAction onClick={() => setCreateSessionDialog(true)} altText="new session">
              New session
            </ToastAction>
          </div>
        ),
      });
  });

  // Update the oudated session to completed
  useEffect(() => {
    for (const session of outdatedSession) {
      updateSession({
        _id: session._id,
        session: {
          status: EnumSessionStatus.COMPLETED,
        },
      });
    }
  }, [outdatedSession, updateSession]);

  useEffect(() => {
    if (validSession && phase === EnumSessionPhase.NONE) {
      console.log("[Session] There is a valid session", validSession);
      dismiss();
      const currentTime = new Date().getTime();

      const learningEndTime =
        new Date(validSession.createdAt).getTime() + validSession.duration * 1000;
      const sessionEndTime = learningEndTime + (validSession.break ?? 0) * 1000;

      if (currentTime < learningEndTime) {
        setPhase(EnumSessionPhase.LEARNING);
        startCountdown(Math.floor((learningEndTime - currentTime) / 1000));
      } else if (currentTime < sessionEndTime) {
        setPhase(EnumSessionPhase.BREAKING);
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
          status: EnumSessionStatus.COMPLETED,
        },
      });
      audioRef.play();
      setValidSession(undefined);
      setPhase(EnumSessionPhase.NONE);
    }
  }, [updateSession, validSession, audioRef]);

  useEffect(() => {
    if (timeLeft === 0 && validSession && phase !== EnumSessionPhase.NONE) {
      console.log("[Session] Countdown completed", phase, validSession);
      if (phase === EnumSessionPhase.LEARNING && validSession.break) {
        console.log("[Session] Starting break time");
        setPhase(EnumSessionPhase.BREAKING);
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
