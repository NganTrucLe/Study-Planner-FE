import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { PagedData, PagingSchema } from "@/lib/types/pagination.type";
import { startOfDay, addDays, isSameDay } from "date-fns";
import { Task } from "./types/task.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSearchParams = (
  data: Record<string, string | string[] | number | boolean | undefined>
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

export const getTasksByDay = (start: string, tasks: Task[]) => {
  const startOfWeek = startOfDay(new Date(start));
  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
    return addDays(startOfWeek, i);
  });

  let res = daysInWeek.map((day) => {
    return {
      dayOfWeek: day,
      tasks: 0,
      focusTime: 0,
    };
  });

  tasks.forEach((task) => {
    const dayIndex = daysInWeek.findIndex((day) => isSameDay(day, task.startDate));
    if (dayIndex !== -1) {
      res[dayIndex].tasks += 1;
      // res[dayIndex].focusTime += 1;
    }
  });
  return res;
};
