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
  let result: Record<string, (Task & { offset: number })[]> = {};
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const start = startOfDay(task.startDate);
    const index = start.toISOString();
    if (!result[index]) {
      result[index] = [];
    }
    if (
      result[index].length > 0 &&
      result[index][result[index].length - 1].endDate.getTime() > task.startDate.getTime()
    ) {
      result[index].push({
        ...task,
        offset: result[index][result[index].length - 1].offset + 1,
      });
      continue;
    }
    result[index].push({
      ...task,
      offset: 0,
    });
  }
  return result;
};

export const modifyTaskOffsets = (tasks: (Task & { offset: number })[]) => {
  tasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  if (tasks.length == 0) return [];
  for (let i = 0; i < tasks.length; i++) {
    if (i == 0) continue;
    if (tasks[i].startDate.getTime() < tasks[i - 1].endDate.getTime()) {
      tasks[i].offset = tasks[i - 1].offset + 1;
    }
  }
  return tasks;
};
