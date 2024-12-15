import { subWeeks, subMonths, addWeeks, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "./type";
import { getRange } from "./utils";
import { useCalendar } from "./calendar-context";

const CalendarHeader = () => {
  const { localDate, type, onChangeLocalDate, onChangeTime } = useCalendar();
  const [range, setRange] = useState<CalendarRange>(getRange(localDate, type));

  const getPrevRange = () => {
    const prevDate = type == "weekly" ? subWeeks(localDate, 1) : subMonths(localDate, 1);
    onChangeLocalDate(prevDate);
    return getRange(prevDate, type);
  };

  const getNextRange = () => {
    const prevDate = type == "weekly" ? addWeeks(localDate, 1) : addMonths(localDate, 1);
    onChangeLocalDate(prevDate);
    return getRange(prevDate, type);
  };
  return (
    <div className="mb-5 flex flex-row items-center gap-2">
      <div className="w-60">
        <h6 className="text-xl font-semibold">{format(localDate, "MMMM yyyy")}</h6>
        <p className="font-medium text-gray-400">
          {format(range.start, "MMM dd, yyyy")} - {format(range.end, "MMM dd, yyyy")}
        </p>
      </div>
      <Button className="ml-8 size-10 p-2 text-gray-500" variant="outline">
        <ChevronLeft
          onClick={() => {
            const range = getPrevRange();
            setRange(range);
            onChangeTime(range);
          }}
        />
      </Button>
      <Button variant="outline" className="size-10 p-2 text-gray-500">
        <ChevronRight
          onClick={() => {
            const range = getNextRange();
            setRange(range);
            onChangeTime(range);
          }}
        />
      </Button>
    </div>
  );
};
export default CalendarHeader;
