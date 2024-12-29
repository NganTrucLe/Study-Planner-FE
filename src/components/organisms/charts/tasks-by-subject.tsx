import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { subject: "math", tasks: 275, fill: "var(--color-math)" },
  { subject: "science", tasks: 200, fill: "var(--color-science)" },
  { subject: "history", tasks: 187, fill: "var(--color-history)" },
  { subject: "english", tasks: 173, fill: "var(--color-english)" },
  { subject: "art", tasks: 90, fill: "var(--color-art)" },
];

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  math: {
    label: "Math",
    color: "hsl(var(--chart-1))",
  },
  science: {
    label: "Science",
    color: "hsl(var(--chart-2))",
  },
  history: {
    label: "History",
    color: "hsl(var(--chart-3))",
  },
  english: {
    label: "English",
    color: "hsl(var(--chart-4))",
  },
  art: {
    label: "Art",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function TasksBySubject() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tasks by subject</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="tasks" hideLabel />} />
            <Pie data={chartData} dataKey="tasks">
              <LabelList
                dataKey="subject"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
