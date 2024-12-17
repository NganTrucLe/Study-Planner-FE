import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";
import { DialogClose } from "../../ui/dialog";
import { subjectColors, SubjectOption, taskPriorities, taskStatuses } from "@/lib/constants";
import { useGetSubjects } from "@/hooks/react-query/useSubjects";
import FormSelect from "@/components/mocules/form-inputs/form-select";
import FormTextArea from "@/components/mocules/form-inputs/form-text-area";
import FormDateTimePicker from "@/components/mocules/form-inputs/form-date-time-picker";

const formSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  priorityLevel: z.nativeEnum(EnumTaskPriority).optional(),
  startDate: z.date().or(z.string()),
  endDate: z.date().or(z.string()),
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
      startDate: new Date(),
      endDate: new Date(),
      status: EnumTaskStatus.TODO,
      priorityLevel: EnumTaskPriority.MEDIUM,
    },
  });

  function onSubmit(data: FormInputs) {
    onTaskMutate(data);
    form.reset();
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
                  onChange={field.onChange}
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
        <DialogClose disabled={!form.formState.isValid}>
          <Button className="w-full" type="submit">
            {initialData ? "Update Task" : "Add Task"}
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default TaskForm;
