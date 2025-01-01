import TasksByDay from "../organisms/charts/tasks-by-day";
import TasksBySubject from "../organisms/charts/tasks-by-subject";
import { Card, CardHeader, CardTitle, CardContent, Typography, Badge } from "../ui";
import mockTasksBySubject from "@/components/organisms/charts/mock-tasks-by-subject.json";
import mockTasksByDay from "@/components/organisms/charts/mock-tasks-by-day.json";
import { DateTimePicker } from "../ui/date-time-picker";

const DASHBOARD_CARDS = [
  {
    title: <Badge color="primary">Done</Badge>,
    content: (
      <Typography variant="h2">
        12 <span className="text-base font-normal">tasks</span>
      </Typography>
    ),
  },
  {
    title: <Badge variant="blue">In progress</Badge>,
    content: (
      <Typography variant="h2">
        12 <span className="text-base font-normal">tasks</span>
      </Typography>
    ),
  },
  {
    title: <Badge variant="secondary">To do</Badge>,
    content: (
      <Typography variant="h2">
        12 <span className="text-base font-normal">tasks</span>
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
];
export default function AnalyticsPage() {
  return (
    <div className="w-full">
      <div className="mb-4 flex w-full flex-row justify-between border-b border-neutral-200 px-8 py-4">
        <Typography variant="h2">Analytics</Typography>
        <div className="w-70">
          <DateTimePicker onChange={() => {}} value={undefined} />
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
        <TasksByDay className="col-span-8" chartData={mockTasksByDay} chartType="monthly" />
        <TasksBySubject className="col-span-4" chartData={mockTasksBySubject} />
      </div>
    </div>
  );
}
