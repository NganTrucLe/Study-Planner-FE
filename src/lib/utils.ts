import { type ClassValue, clsx } from "clsx";
import { differenceInDays, format } from "date-fns";
import { twMerge } from "tailwind-merge";

import { PagedData, PagingSchema } from "@/lib/types/pagination.type";
import { startOfDay, addDays, isSameDay } from "date-fns";
import { Task } from "./types/task.type";
import { Session } from "./types/session.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSearchParams = (
  data: Record<string, string | string[] | number | boolean | undefined | Date>
) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val !== "") {
            params.append(key, val.toString());
          }
        });
      } else {
        params.append(key, value.toString());
      }
    }
  }

  return params.toString();
};

export const fromOffsetToPage = <T, K extends string>(value: PagedData<T, K>) => {
  if (!value.offset || !value.limit) return { page: 1, pageSize: 10 };
  return {
    page: Math.ceil(value.offset / value.limit) + 1,
    pageSize: value.limit,
  };
};

export const fromPageToOffset = (value: PagingSchema) => {
  return {
    offset: (value.page - 1) * value.pageSize,
    limit: value.pageSize,
  };
};

export function toIsoString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const getTasksByDay = (start: string, end: string, tasks: Task[], sessions: Session[]) => {
  const startOfTime = startOfDay(new Date(start));
  const days = Array.from({ length: differenceInDays(end, start) + 1 }, (_, i) => {
    return addDays(startOfTime, i);
  });

  let res = days.map((day) => {
    return {
      dayOfWeek: day,
      tasks: 0,
      focusTime: 0,
    };
  });

  tasks.forEach((task) => {
    const dayIndex = days.findIndex((day) => isSameDay(day, task.startDate));
    if (dayIndex !== -1) {
      res[dayIndex].tasks += 1;
      // res[dayIndex].focusTime += 1;
    }
  });
  sessions.forEach((session) => {
    const dayIndex = days.findIndex((day) => isSameDay(day, session.createdAt));
    if (dayIndex !== -1) {
      res[dayIndex].focusTime += session.trueDuration / 3600;
    }
  });
  return res;
};
