import React, { useEffect, useState } from "react";
import { CELL_HEIGHT } from "./constants";

const TimestampTrackLine = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [time, setTime] = useState({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime({
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute z-50 inline-flex w-full items-center justify-end text-xs text-gray-400"
      style={{
        top: `${time.hour * CELL_HEIGHT + Math.floor(time.minute / 15) * (CELL_HEIGHT / 4)}px`,
      }}
    >
      <div className="w-20 px-4">
        <span className="w-full rounded-full bg-primary px-2 py-1 text-center text-white">
          {`${(time.hour % 12 || 12).toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`}
        </span>
      </div>
      <span className="h-px w-20 flex-1 bg-primary" />
    </div>
  );
});

export default TimestampTrackLine;
