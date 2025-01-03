import TasksByDay from "../organisms/charts/tasks-by-day";
import TasksBySubject from "../organisms/charts/tasks-by-subject";
import { Card, CardHeader, CardTitle, CardContent, Typography, Badge } from "../ui";
import { useTasks } from "@/hooks/react-query/useTasks";
import { endOfWeek, startOfWeek } from "date-fns";
import { getTasksByDay } from "@/lib/utils";
import { useMemo, useState } from "react";
import { MAPPED_COLORS } from "@/lib/constants";
import _ from "lodash";
import { EnumTaskStatus } from "@/lib/enums";
import { WeekPicker } from "../ui/week-picker";
import { DateRange } from "react-day-picker";

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  });
  const { data } = useTasks({ from: range.from, to: range.to });

  const tasksByDay = useMemo(() => {
    return range.from ? getTasksByDay(range.from.toString(), data?.tasks ?? []) : [];
  }, [data, range.from]);

  const tasksBySubject = useMemo(() => {
    return (
      data?.tasks.map((task) => {
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
  }, [data]);

  const tasksByStatus = useMemo(() => {
    return _.groupBy(data?.tasks, "status");
  }, [data]);

  const DASHBOARD_CARDS = useMemo(
    () => [
      {
        title: <Badge color="primary">Done</Badge>,
        content: (
          <Typography variant="h2">
            {tasksByStatus[EnumTaskStatus.DONE]?.length ?? 0}&nbsp;
            <span className="text-base font-normal">tasks</span>
          </Typography>
        ),
      },
      {
        title: <Badge variant="blue">In progress</Badge>,
        content: (
          <Typography variant="h2">
            {tasksByStatus[EnumTaskStatus.IN_PROGRESS]?.length ?? 0}&nbsp;
            <span className="text-base font-normal">tasks</span>
          </Typography>
        ),
      },
      {
        title: <Badge variant="secondary">To do</Badge>,
        content: (
          <Typography variant="h2">
            {tasksByStatus[EnumTaskStatus.TODO]?.length ?? 0}&nbsp;
            <span className="text-base font-normal">tasks</span>
          </Typography>
        ),
      },
      {
        title: (
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Today's focus time
          </CardTitle>
        ),
        content: (
          <div className="flex flex-row gap-2">
            <Typography variant="h2">
              4 <span className="text-base font-normal">hours</span>
            </Typography>
            <Typography variant="h2">
              15 <span className="text-base font-normal">mins</span>
            </Typography>
          </div>
        ),
      },
    ],
    [data]
  );

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full flex-row justify-between border-b border-neutral-200 px-8 py-4">
        <Typography variant="h2">Analytics</Typography>
        <div className="w-70">
          <WeekPicker value={range} onChange={setRange} />
        </div>
      </div>
      <div className="grid w-full grid-cols-12 gap-4 px-8 pt-4">
        {DASHBOARD_CARDS.map((card, index) => (
          <Card key={index} className="col-span-3">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
          </Card>
        ))}
        <TasksByDay className="col-span-8" chartData={tasksByDay} chartType="weekly" />
        <TasksBySubject className="col-span-4" chartData={tasksBySubject} />
      </div>
    </div>
  );
}
