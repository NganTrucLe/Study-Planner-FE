import { taskCardVariants } from "@/components/mocules/task-card";
import { VariantProps } from "class-variance-authority";

export type CalendarTimeRangeType = "weekly" | "monthly";
export type CalendarRange = {
  start: Date;
  end: Date;
};

export type Task = {
  _id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  color: VariantProps<typeof taskCardVariants>["color"];
};
