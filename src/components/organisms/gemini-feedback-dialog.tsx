import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useGetSessions } from "@/hooks/react-query/useSessions";
import { useGetSubjects } from "@/hooks/react-query/useSubjects";
import { useGenerateFeedback, useTasks } from "@/hooks/react-query/useTasks";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function GeminiFeedbackDialog() {
  const { data: taskData } = useTasks({});
  const { data: subjectData } = useGetSubjects();
  const { data: sessionData } = useGetSessions({});
  const { mutate, isPending } = useGenerateFeedback();
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<string>("");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open && taskData?.tasks.length && subjectData?.length && sessionData?.length)
          mutate(
            {
              tasks: taskData.tasks,
              subjects: subjectData,
              sessions: sessionData,
              forceCall: true,
            },
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
          AI Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedbacks for your work</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96">
          {isPending ? (
            <div className="grid h-96 w-full place-items-center text-muted-foreground">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : taskData?.tasks.length || subjectData.length || sessionData?.length ? (
            <ReactMarkdown children={response ?? ""} remarkPlugins={[remarkGfm]} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No data found</p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => {
              if (taskData?.tasks.length && subjectData?.length && sessionData?.length)
                mutate(
                  {
                    tasks: taskData.tasks,
                    subjects: subjectData,
                    sessions: sessionData,
                    forceCall: true,
                  },
                  {
                    onSuccess: (data) => {
                      setResponse(data);
                    },
                  }
                );
            }}
          >
            Regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
