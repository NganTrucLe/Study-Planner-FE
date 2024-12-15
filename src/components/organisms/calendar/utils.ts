import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay } from "date-fns";
import { CalendarTimeRangeType, Task } from "./type";
import { TIMES } from "./constants";

export const getRange = (day: Date, type: CalendarTimeRangeType) => {
  if (type == "weekly") {
    const start = startOfWeek(day);
    const end = endOfWeek(day);
    return {
      start,
      end,
    };
  } else {
    const start = startOfWeek(startOfMonth(day));
    const end = endOfWeek(endOfMonth(day));
    return { start, end };
  }
};

export const mapTimeLabel = (hour: number) => {
  return TIMES.find((time) => time.time == hour)?.label;
};

export const parseTaskArrayToCalendar = (tasks: Task[]) => {
  tasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()); // sort by start date ascending
  let result: Record<string, Task[]> = {};
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const start = startOfDay(task.startDate);
    console.log(start);
    if (!result[start.toISOString()]) {
      result[start.toISOString()] = [];
    }
    result[start.toISOString()].push(task);
  }
  return result;
};
