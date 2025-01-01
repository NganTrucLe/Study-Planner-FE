import { endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns";

import { Task, TaskFormValueWithId } from "@/lib/types/task.type";

import { TIMES } from "./constants";
import { CalendarTimeRangeType } from "./type";

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
  tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); // sort by start date ascending
  const result: Record<string, (Task & { offset: number })[]> = {};
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const start = startOfDay(task.startDate);
    const index = start.toISOString();
    if (!result[index]) {
      result[index] = [];
    }
    if (
      result[index].length > 0 &&
      new Date(result[index][result[index].length - 1].endDate).getTime() >
        new Date(task.startDate).getTime()
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
  tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  if (tasks.length == 0) return [];
  for (let i = 0; i < tasks.length; i++) {
    if (i == 0) continue;
    if (new Date(tasks[i].startDate).getTime() < new Date(tasks[i - 1].endDate).getTime()) {
      tasks[i].offset = tasks[i - 1].offset + 1;
    }
  }
  return tasks;
};

export const parseTask = (task: Task): TaskFormValueWithId => {
  return {
    ...task,
    startDate: new Date(task.startDate),
    endDate: new Date(task.endDate),
    subjectId: task.subjectId?._id,
  };
};

export const removeTaskId = <T extends { _id: string }>(task: T): Omit<T, "_id"> => {
  const { _id, ...rest } = task;
  return rest;
};
