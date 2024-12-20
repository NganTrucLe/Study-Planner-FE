export enum EnumDraggableItemType {
  TASK = "TASK",
}

export enum EnumGender {
  MALE = "male",
  FEMALE = "female",
}

export enum EnumActionOTP {
  resetPassword = "reset-password",
  verifyEmail = "verify-mail",
}

export enum EnumTaskStatus {
  TODO = "to-do",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export type TaskStatus = `${EnumTaskStatus}`; // "to-do" | "in-progress" | "done"

export enum EnumTaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export type TaskPriorityLevel = `${EnumTaskPriority}`; // "low" | "medium" | "high"

export enum EnumTaskColor {
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  YELLOW = "yellow",
  PURPLE = "purple",
  ORANGE = "orange",
  PINK = "pink",
}
