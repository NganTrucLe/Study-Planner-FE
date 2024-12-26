import FormSelect from "@/components/mocules/form-inputs/form-select";
import { Button, Form } from "@/components/ui";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTasks } from "@/hooks/react-query/useTasks";
import { BREAK_TIMES, LEARNING_DURATIONS } from "@/lib/constants";
import { EnumTaskStatus } from "@/lib/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  duration: z.string(),
  break: z.string().optional(),
  taskIds: z.array(z.string()).nonempty(),
});

type FormInputs = z.infer<typeof formSchema>;

const CreateSessionDialog = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useTasks({ status: [EnumTaskStatus.IN_PROGRESS] });
  const filteredTasks = useMemo(
    () =>
      data?.tasks.filter((task) => {
        const currentTime = new Date();
        const taskEndTime = new Date(task.endDate);
        const taskStartTime = new Date(task.startDate);
        return taskEndTime > currentTime && taskStartTime < currentTime;
      }),
    [data]
  );
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: "25",
      break: "5",
      taskIds: [],
    },
  });

  function onSubmit(data: FormInputs) {
    console.log(data);
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
                filteredTasks?.map((task) => ({
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
