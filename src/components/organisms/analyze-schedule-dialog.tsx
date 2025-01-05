import { Loader2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useCalendar } from "./calendar/calendar-context";
import { useAnalyzeSchedule, useTasks } from "@/hooks/react-query/useTasks";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AnalyzeScheduleDialog() {
  const { range } = useCalendar();
  const { data } = useTasks({ from: range.start.toString() });
  const { mutate, isPending } = useAnalyzeSchedule(range);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<string>("");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open && data?.tasks.length)
          mutate(
            { tasks: data.tasks, forceCall: true },
            {
              onSuccess: (data) => {
                setResponse(data);
              },
            }
          );
      }}
    >
      <DialogTrigger asChild>
        <Button variant="yellow">
          <Sparkles size={20} className="mr-2" />
          Analyze
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Analyze your schedule</DialogTitle>
          <DialogDescription>
            from {range.start.toDateString()} to {range.end.toDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          {isPending ? (
            <div className="grid h-96 w-full place-items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : data?.tasks.length ? (
            <ReactMarkdown children={response ?? ""} remarkPlugins={[remarkGfm]} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No tasks found in this week</p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => {
              if (data?.tasks.length)
                mutate(
                  { tasks: data.tasks, forceCall: true },
                  {
                    onSuccess: (data) => {
                      setResponse(data);
                    },
                  }
                );
            }}
          >
            Reanalyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
