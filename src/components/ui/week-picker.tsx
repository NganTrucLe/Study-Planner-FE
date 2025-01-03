"use client";

import * as React from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useEffect } from "react";

type WeekPickerProps = {
  onChange: (range: DateRange) => void;
  value: DateRange | undefined;
};

export function WeekPicker({ onChange, value }: WeekPickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  useEffect(() => {
    date && onChange(date);
  }, [date, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a week</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={date}
          onDayClick={(day) => {
            setDate({
              from: startOfWeek(day),
              to: endOfWeek(day),
            });
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
