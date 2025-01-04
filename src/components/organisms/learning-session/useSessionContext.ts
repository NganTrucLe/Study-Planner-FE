import { createContext, useContext } from "react";

import { Session } from "@/lib/types/session.type";

export type SessionContextProps = {
  session?: Session;
  phase: "learning" | "breaking" | "none";
  isRunning: boolean;
  time: string;
  pause: () => void;
  resume: () => void;
  createSessionDialog: boolean;
  setCreateSessionDialog: (value: boolean) => void;
  handleCompleteSession: () => void;
};

export const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
