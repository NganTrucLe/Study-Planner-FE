import { ChartType } from "@/components/organisms/charts/tasks-by-day";
import { useTasks } from "@/hooks/react-query/useTasks";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { getTasksByDay } from "@/lib/utils";
import { useMemo, useState } from "react";
import { MAPPED_COLORS } from "@/lib/constants";
import _ from "lodash";
import { EnumSessionStatus } from "@/lib/enums";
import { DateRange } from "react-day-picker";
import { useGetSessions } from "@/hooks/react-query/useSessions";

export default function useAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("weekly");
  const [range, setRange] = useState<DateRange>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  });
  const { data: taskData } = useTasks(range);
  const { data: sessionData } = useGetSessions({
    from: range.from,
    to: range.to,
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
          taskData?.tasks ?? [],
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
  };
}
