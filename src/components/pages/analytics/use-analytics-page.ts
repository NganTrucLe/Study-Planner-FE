import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import _ from "lodash";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { ChartType } from "@/components/organisms/charts/tasks-by-day";
import { useGetSessions } from "@/hooks/react-query/useSessions";
import { useTasks } from "@/hooks/react-query/useTasks";
import { MAPPED_COLORS } from "@/lib/constants";
import { EnumSessionStatus } from "@/lib/enums";
import { Task } from "@/lib/types/task.type";
import { getTasksByDay } from "@/lib/utils";

export default function useAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("weekly");
  const [range, setRange] = useState<DateRange>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  });
  const { data: taskData } = useTasks({
    ...range,
    limit: 1000,
  });
  const { data: sessionData } = useGetSessions({
    from: range.from,
    to: range.to,
    status: [EnumSessionStatus.COMPLETED],
  });

  const { data: todaySessions } = useGetSessions({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
    status: [EnumSessionStatus.COMPLETED],
  });

  const handleChangeChartType = (value: ChartType) => {
    setChartType(value);
    const currentDay = range.from ? new Date(range.from) : new Date();
    if (value == "weekly") {
      setRange({
        from: startOfWeek(currentDay),
        to: endOfWeek(currentDay),
      });
    } else {
      setRange({
        from: startOfMonth(currentDay),
        to: endOfMonth(currentDay),
      });
    }
  };

  const tasksByDay = useMemo(() => {
    return range.from && range.to
      ? getTasksByDay(
          range.from.toString(),
          range.to.toString(),
          (taskData?.tasks.filter((t) => t.startDate && t.endDate) as Task[]) ?? [],
          sessionData ?? []
        )
      : [];
  }, [taskData]);

  const tasksBySubject = useMemo(() => {
    return (
      taskData?.tasks.map((task) => {
        if (task.subjectId) {
          return {
            subject: task.subjectId.name,
            priority: task.priorityLevel,
            color: MAPPED_COLORS[task.subjectId.color].backgroundColor,
            ...task,
          };
        } else
          return {
            subject: "Others",
            priority: task.priorityLevel,
            color: "lightgray",
            ...task,
          };
      }) ?? []
    );
  }, [taskData]);

  const tasksByStatus = useMemo(() => {
    return _.groupBy(taskData?.tasks, "status");
  }, [taskData]);

  const totalFocusTimeToday = useMemo(() => {
    return (
      todaySessions?.reduce((acc, session) => {
        return acc + session.trueDuration;
      }, 0) ?? 0
    );
  }, [todaySessions]);
  console.log(totalFocusTimeToday);

  const totalFocusTimeInRange = useMemo(() => {
    return (
      sessionData?.reduce((acc, session) => {
        return acc + session.trueDuration;
      }, 0) ?? 0
    );
  }, [sessionData]);

  const maxFocusTime = useMemo(() => {
    const groups = _.groupBy(sessionData, (session) => new Date(session.createdAt).getDate());
    let maxTime = 0;
    for (const key in groups) {
      const total = groups[key].reduce((acc, session) => acc + session.trueDuration, 0);
      if (total > maxTime) maxTime = total;
    }
    return maxTime;
  }, [sessionData]);

  const focusTimeByHour = useMemo(() => {
    const groups = _.groupBy(sessionData, (session) => new Date(session.createdAt).getHours());
    return Array.from({ length: 24 }, (__, i) => {
      return {
        hour: i,
        days: _.uniqBy(groups[i.toString()], (session) => new Date(session.createdAt).getDate())
          .length,
      };
    });
  }, [sessionData]);

  return {
    chartType,
    setChartType,
    range,
    setRange,
    taskData,
    sessionData,
    handleChangeChartType,
    tasksByDay,
    tasksBySubject,
    tasksByStatus,
    totalFocusTimeToday,
    totalFocusTimeInRange,
    maxFocusTime,
    focusTimeByHour,
  };
}
