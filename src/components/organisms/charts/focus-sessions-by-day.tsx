import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, Typography } from "@/components/ui";
import { format } from "date-fns";

const chartData = [
  { dayOfWeek: "12/22/2024", tasks: 11 },
  { dayOfWeek: "12/23/2024", tasks: 2 },
  { dayOfWeek: "12/24/2024", tasks: 3 },
  { dayOfWeek: "12/25/2024", tasks: 2 },
  { dayOfWeek: "12/26/2024", tasks: 7 },
  { dayOfWeek: "12/27/2024", tasks: 2 },
  { dayOfWeek: "12/28/2024", tasks: 10 },
];

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "#84c5aa",
  },
} satisfies ChartConfig;

export default function FocusSessionsByDay() {
  return (
    <Card className="rounded-md border py-4 pr-4">
      <CardHeader className="items-center pb-0">
        <CardTitle> Focus sessions by day in week</CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="dayOfWeek"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
          />
          <YAxis tickLine={false} axisLine={false} tickCount={5} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
