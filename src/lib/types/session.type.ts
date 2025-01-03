import { EnumSessionStatus } from "../enums";

export type Session = {
  _id: string;
  duration: number;
  break?: number;
  trueDuration: number;
  status: EnumSessionStatus;
  taskIds: string[];
  userId: string;
  createdAt: string;
};

export type CreateSessionDto = Pick<Session, "duration" | "break" | "taskIds">;
export type UpdateSessionDto = Partial<Omit<Session, "_id">>;
