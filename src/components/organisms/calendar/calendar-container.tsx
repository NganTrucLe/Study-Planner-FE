import { cn } from "@/lib/utils";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { useCalendar } from "./calendar-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CELL_HEIGHT, TIMES } from "./constants";

const CalendarContainer = () => {
  const timeStamp = {
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  };
  const { range, type } = useCalendar();
  const daysOfWeek = eachDayOfInterval(range);
  const today = new Date();

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
              <div
                className="absolute inline-flex w-full items-center justify-end text-xs text-gray-400"
                style={{
                  top: `${timeStamp.hour * CELL_HEIGHT + Math.floor(timeStamp.minute / 15) * (CELL_HEIGHT / 4)}px`,
                }}
              >
                <div className="w-20 px-4">
                  <span className="w-full rounded-full bg-primary px-2 py-1 text-center text-white">
                    {`${timeStamp.hour % 12}:${timeStamp.minute}`}
                  </span>
                </div>
                <span className="h-px w-full flex-1 bg-primary"></span>
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
export default CalendarContainer;
