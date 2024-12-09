import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { CalendarTimeRangeType } from "./type";
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
