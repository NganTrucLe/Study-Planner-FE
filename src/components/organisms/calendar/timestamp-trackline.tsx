import React from "react";
import { useRef, useEffect } from "react";
import { CELL_HEIGHT } from "./constants";

const TimestampTrackLine = React.forwardRef<HTMLDivElement>((_, ref) => {
  const timeStamp = useRef({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  });
  console.log(timeStamp);
  useEffect(() => {
    const interval = setInterval(() => {
      timeStamp.current = {
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      };
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      ref={ref}
      className="absolute inline-flex w-full items-center justify-end text-xs text-gray-400"
      style={{
        top: `${timeStamp.current.hour * CELL_HEIGHT + Math.floor(timeStamp.current.minute / 15) * (CELL_HEIGHT / 4)}px`,
      }}
    >
      <div className="w-20 px-4">
        <span className="w-full rounded-full bg-primary px-2 py-1 text-center text-white">
          {`${(timeStamp.current.hour % 12).toString().padStart(2, "0")}:${timeStamp.current.minute.toString().padStart(2, "0")}`}
        </span>
      </div>
      <span className="h-px w-full flex-1 bg-primary" />
    </div>
  );
});

export default TimestampTrackLine;
