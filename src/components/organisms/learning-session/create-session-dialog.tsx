import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormSelect from "@/components/mocules/form-inputs/form-select";
import { Button, Form } from "@/components/ui";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateSession } from "@/hooks/react-query/useSessions";
import { useTasks } from "@/hooks/react-query/useTasks";
import { BREAK_TIMES, LEARNING_DURATIONS } from "@/lib/constants";
import { EnumTaskStatus } from "@/lib/enums";

import { useSession } from "./useSessionContext";

const formSchema = z.object({
  duration: z.string(),
  break: z.string().optional(),
  taskIds: z.array(z.string()).nonempty(),
});

type FormInputs = z.infer<typeof formSchema>;

const CreateSessionDialog = () => {
  const { mutate: createSession } = useCreateSession();
  const { createSessionDialog: open, setCreateSessionDialog: setOpen } = useSession();
  const { data, isLoading } = useTasks({ status: [EnumTaskStatus.IN_PROGRESS] });

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: LEARNING_DURATIONS[0].value,
      break: BREAK_TIMES[0].value,
      taskIds: [],
    },
  });

  function onSubmit(data: FormInputs) {
    createSession({
      ...data,
      duration: parseInt(data.duration),
      break: data.break ? parseInt(data.break) : undefined,
    });

    setOpen(false);
    form.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Create Session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Learning Session</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormSelect
              name="duration"
              label="Learning Duration"
              loading={isLoading}
              placeholder="Select a learning duration"
              options={LEARNING_DURATIONS}
            />
            <FormSelect
              name="break"
              label="Break Time"
              loading={isLoading}
              placeholder="Select a break time"
              options={BREAK_TIMES}
            />
            <FormSelect
              name="taskIds"
              label="Tasks"
              loading={isLoading}
              placeholder="Select tasks"
              isMulti
              options={
                data?.tasks?.map((task) => ({
                  label: task.name,
                  value: task._id,
                })) || []
              }
            />
            <Button className="w-full" type="submit">
              Start Session
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionDialog;
