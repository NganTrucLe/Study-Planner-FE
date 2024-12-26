import { create } from "zustand";

type Session = {
  duration: number;
  break: number;
  taskIds: string[];
};

type States = {
  state: "idle" | "running" | "paused";
  learningState: "idle" | "learning" | "breaking";
  session: Session;
};

type Actions = {
  setStart: (session: Session) => void;
  setBreak: () => void;
  setStop: () => void;
  setPause: () => void;
  setResume: () => void;
};

export const useSessionStore = create<States & Actions>((set) => ({
  state: "running",
  learningState: "learning",
  session: {
    duration: 10,
    break: 5,
    taskIds: [],
  },
  setStart: (session: Session) => {
    localStorage.setItem("session-state", "running");
    set({ state: "running", learningState: "learning", session });
  },
  setBreak: () => set({ state: "running", learningState: "breaking" }),
  setStop: () => set({ state: "idle" }),
  setPause: () => {
    localStorage.setItem("session-state", "paused");
    set({ state: "paused" });
  },
  setResume: () => set({ state: "running" }),
}));
