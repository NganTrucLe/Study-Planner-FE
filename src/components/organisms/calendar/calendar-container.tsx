import { cn } from "@/lib/utils";
import { eachDayOfInterval, format, isSameDay, isSameWeek } from "date-fns";
import { useCalendar } from "./calendar-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TIMES } from "./constants";
import { useRef, useEffect } from "react";
import TimestampTrackLine from "./timestamp-trackline";

const CalendarContainer = () => {
  const { range, type } = useCalendar();
  const showTimeDivider = isSameWeek(range.start, new Date());
  const daysOfWeek = eachDayOfInterval(range);
  const today = new Date();
  const timeDividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showTimeDivider && timeDividerRef.current) {
      timeDividerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTimeDivider]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border">
      {type == "monthly" ? (
        <p>Not supported yet</p>
      ) : (
        <>
          <div className="grid grid-cols-[80px_repeat(7,_minmax(0,_1fr))]">
            <div className="border-b border-r bg-gray-100"></div>
            <div className="col-span-7 grid w-full grid-cols-subgrid border-b">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 border-r bg-gray-100 p-4 text-center text-sm text-gray-600 last:border-none",
                    isSameDay(day, today) &&
                      "box-content border-b-2 border-b-primary bg-primary/10 font-semibold text-primary"
                  )}
                >
                  <p className="text-wrap">{format(day, "EEEE dd")}</p>
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className="h-full flex-1">
            <div className="relative grid w-full grid-cols-[80px_repeat(7,_minmax(0,_1fr))]">
              <div className="border-r">
                {TIMES.map(({ label }, index) => (
                  <div
                    key={index}
                    className="relative h-10 border-b p-4 text-center text-sm text-gray-600 [&_p]:first:hidden"
                  >
                    <p className="absolute right-1/2 top-0 -translate-y-1/2 translate-x-1/2 bg-white px-2 text-center">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              {Array.from({ length: 7 }).map((_, index) => (
                <div className="flex-1 border-r last:border-none" key={index}>
                  {TIMES.map(({ label }) => (
                    <div
                      key={label}
                      className="relative h-10 cursor-pointer border-b p-4 text-center text-sm text-gray-600 hover:bg-gray-50 [&_p]:first:hidden"
                    >
                      {/* TODO: Task hover */}
                    </div>
                  ))}
                </div>
              ))}
              {showTimeDivider && <TimestampTrackLine ref={timeDividerRef} />}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
export default CalendarContainer;
