import { Label, LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { taskPriorities } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { EnumTaskPriority } from "@/lib/enums";
import { groupBy } from "lodash";

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
} satisfies ChartConfig;

type TasksBySubjectProps = {
  className?: string;
  chartData?: {
    subject: string;
    priority: EnumTaskPriority | string;
  }[];
};

export default function TasksBySubject({ className, chartData: data2 = [] }: TasksBySubjectProps) {
  const adaptedData = Object.entries(groupBy(data2, "subject"))
    .map(([subject, tasks]) => {
      return {
        subject,
        tasks: tasks.length,
        fill: `var(--color-${subject})`,
      };
    })
    .sort((a, b) => b.tasks - a.tasks);
  const priorityData = groupBy(data2, "priority");
  const maxTasks = Object.values(priorityData).reduce((acc, cur) => Math.max(acc, cur.length), 0);

  const adaptedChartConfig = adaptedData.reduce((acc, cur, index) => {
    return {
      ...acc,
      [cur.subject]: {
        label: cur.subject,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      },
    };
  }, chartConfig) satisfies ChartConfig;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Tasks by subject and priority</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-evenly">
        <ChartContainer
          config={adaptedChartConfig}
          className="mx-auto aspect-square max-h-[250px] flex-1 [&_.recharts-text]:fill-black"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={adaptedData}
              dataKey="tasks"
              startAngle={90}
              endAngle={-270}
              innerRadius={50}
              outerRadius={100}
              label
              nameKey="subject"
            >
              <LabelList
                dataKey="subject"
                className="!fill-background"
                stroke="none"
                fill="#fff"
                fontSize={12}
                formatter={(value: keyof typeof adaptedChartConfig) =>
                  adaptedChartConfig[value]?.label.slice(0, 8)
                }
              />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data2.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-4">
          {taskPriorities.map(({ value, label, icon }) => (
            <div className="flex flex-row items-center gap-2">
              <div className="inline-flex w-1/3 items-center text-sm font-semibold capitalize">
                <span className="mr-2">{icon}</span>
                {label}
              </div>
              <Progress
                className="w-full"
                value={((priorityData[value]?.length ?? 0) / maxTasks) * 100}
              />
              <span className="text-sm font-normal">{priorityData[value]?.length ?? 0}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
