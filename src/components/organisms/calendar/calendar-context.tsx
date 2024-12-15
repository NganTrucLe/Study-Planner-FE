import { createContext, useContext, useState, PropsWithChildren } from "react";
import { CalendarRange, CalendarTimeRangeType } from "./type";
import { getRange } from "./utils";
import { startOfDay } from "date-fns";

type CalendarContextProps = {
  range: CalendarRange;
  type: CalendarTimeRangeType;
  localDate: Date;
  onChangeTime: (range: CalendarRange) => void;
  onChangeLocalDate: (date: Date) => void;
};

type CalendarProviderProps = {
  type?: CalendarTimeRangeType;
  day?: Date;
};

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

export const CalendarProvider = ({
  children,
  ...props
}: PropsWithChildren<CalendarProviderProps>) => {
  const { type = "weekly", day = new Date() } = props;
  const [localDate, setLocalDate] = useState(startOfDay(day));
  const [range, setRange] = useState<CalendarRange>(getRange(localDate, type));

  return (
    <CalendarContext.Provider
      value={{
        type,
        range,
        localDate,
        onChangeLocalDate: setLocalDate,
        onChangeTime: setRange,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextProps => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
