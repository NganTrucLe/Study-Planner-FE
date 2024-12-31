export type Session = {
  _id: string;
  duration: number;
  break?: number;
  trueDuration: number;
  status: "active" | "completed" | "cancelled";
  taskIds: string[];
  userId: string;
  createdAt: string;
};

export type CreateSessionDto = Pick<Session, "duration" | "break" | "taskIds">;
export type UpdateSessionDto = Partial<Omit<Session, "_id">>;
