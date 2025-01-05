import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormDateTimePicker from "@/components/mocules/form-inputs/form-date-time-picker";
import FormSelect from "@/components/mocules/form-inputs/form-select";
import FormTextArea from "@/components/mocules/form-inputs/form-text-area";
import { Input } from "@/components/ui/input";
import { useGetSubjects } from "@/hooks/react-query/useSubjects";
import { subjectColors, SubjectOption, taskPriorities, taskStatuses } from "@/lib/constants";
import { EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";

const formSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  priorityLevel: z.nativeEnum(EnumTaskPriority),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.nativeEnum(EnumTaskStatus),
  subjectId: z.string().optional(),
});

type FormInputs = z.infer<typeof formSchema>;

const TaskForm = ({
  onTaskMutate,
  initialData,
}: {
  onTaskMutate: (data: FormInputs) => void;
  initialData?: FormInputs;
}) => {
  const { data: subjects, isLoading } = useGetSubjects();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      status: EnumTaskStatus.TODO,
      priorityLevel: EnumTaskPriority.MEDIUM,
    },
  });

  function onSubmit(data: FormInputs) {
    onTaskMutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter task name"
                  error={Boolean(form.formState.errors.name)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormTextArea name="description" label="Description" />
        <div className="grid grid-cols-2 gap-4">
          <FormDateTimePicker name="startDate" label="Start Date" />
          <FormDateTimePicker name="endDate" label="End Date" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect name="status" label="Status" options={taskStatuses} />
          <FormSelect
            name="priorityLevel"
            label="Priority"
            options={taskPriorities}
            placeholder="Select a priority"
            renderSelectItem={(priority) => (
              <span className="flex items-center gap-2">
                {priority.icon}
                {priority.label}
              </span>
            )}
          />
        </div>
        <FormSelect
          name="subjectId"
          label="Subject"
          loading={isLoading}
          placeholder="Select a subject"
          options={
            subjects?.map((subject) => ({
              value: subject._id,
              label: subject.name,
              color: subject.color,
            })) || []
          }
          renderSelectItem={(subject: SubjectOption) => {
            const color =
              subjectColors.find((color) => color.value === subject.color)?.color ?? "lightgray";
            return (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-4 rounded-full"
                  style={{
                    backgroundColor: color,
                  }}
                />
                {subject.label}
              </span>
            );
          }}
        />
        <Button disabled={!form.formState.isDirty} className="w-full" type="submit">
          {initialData ? "Update Task" : "Add Task"}
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
