"use client";

import * as React from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useEffect } from "react";

type MonthPickerProps = {
  onChange: (range: DateRange) => void;
  value: DateRange | undefined;
  className?: string;
};

export function MonthPicker({ onChange, value, className }: MonthPickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());

  useEffect(() => {
    date && onChange(date);
  }, [date, onChange]);

  useEffect(() => {
    setYear(date?.from?.getFullYear() ?? new Date().getFullYear());
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? <>{format(date.from, "MMMM, yyyy")}</> : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <div className="flex w-full items-center justify-between">
          <Button
            variant="outline"
            className='"h-7 hover:opacity-100" w-7 bg-transparent p-0 opacity-50'
            onClick={() => setYear(year - 1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="font-bold">{year}</div>
          <Button
            variant="outline"
            className='"h-7 hover:opacity-100" w-7 bg-transparent p-0 opacity-50'
            onClick={() => setYear(year + 1)}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => {
            const month = new Date(new Date().setMonth(i)).setFullYear(year);
            return (
              <Button
                key={i}
                variant={
                  date?.from?.getMonth() === i && date?.from?.getFullYear() === year
                    ? "default"
                    : "outline"
                }
                className={"w-full text-left"}
                onClick={() => {
                  setDate({
                    from: startOfMonth(month),
                    to: endOfMonth(month),
                  });
                }}
              >
                {format(month, "MMMM")}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
