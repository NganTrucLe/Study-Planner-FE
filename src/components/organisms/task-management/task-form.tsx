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
import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";
import { Calendar } from "@components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Circle } from "lucide-react";
import { DialogClose } from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../ui";
import { taskPriorities, taskStatuses } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  priority: z.nativeEnum(EnumTaskPriority).optional(),
  startDate: z.date().or(z.string()),
  endDate: z.date().or(z.string()),
  status: z.nativeEnum(EnumTaskStatus),
  subjectId: z.string().optional(),
});

type FormInputs = z.infer<typeof formSchema>;

const subjects = [
  { id: "1", name: "Math", color: EnumTaskColor.RED },
  { id: "2", name: "Science", color: EnumTaskColor.BLUE },
  { id: "3", name: "History", color: EnumTaskColor.GREEN },
  { id: "4", name: "English", color: EnumTaskColor.YELLOW },
];

const TaskForm = ({
  onTaskMutate,
  initialData,
}: {
  onTaskMutate: (data: FormInputs) => void;
  initialData?: FormInputs;
}) => {
  // const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useSubjects();
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      startDate: new Date(),
      endDate: new Date(),
      status: EnumTaskStatus.TODO,
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "rounded pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <span>{format(new Date(field.value), "dd/MM/yyyy HH:mm")}</span>
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : undefined}
                      onSelect={(date) => {
                        const endDate = new Date(form.getValues("endDate"));
                        if (date) {
                          endDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        }
                        form.setValue("endDate", endDate);
                        field.onChange(date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "rounded pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <span>{format(new Date(field.value), "dd/MM/yyyy HH:mm")}</span>
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : undefined}
                      onSelect={(date) => {
                        const startDate = new Date(form.getValues("startDate"));
                        date?.setFullYear(
                          startDate.getFullYear(),
                          startDate.getMonth(),
                          startDate.getDate()
                        );
                        field.onChange(date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={cn("grid gap-4", initialData && "grid-cols-2")}>
          {initialData && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full rounded border p-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex items-center rounded-full px-2 py-0.5 text-white",
                              taskStatuses.find((status) => status.value === field.value)?.color
                            )}
                          >
                            {taskStatuses.find((status) => status.value === field.value)?.label}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "flex items-center rounded-full px-2 py-1 text-white",
                                  status.color
                                )}
                              >
                                {status.label}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full rounded border p-2">
                      <div className="flex items-center gap-2">
                        {taskPriorities.find((priority) => priority.value === field.value)?.icon}
                        {taskPriorities.find((priority) => priority.value === field.value)?.label ||
                          "Select a priority"}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {taskPriorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            {priority.icon}
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full rounded border p-2">
                    <div className="flex items-center gap-2">
                      {field.value && (
                        <Circle
                          size={16}
                          color={subjects.find((subject) => subject.id === field.value)?.color}
                          fill={subjects.find((subject) => subject.id === field.value)?.color}
                        />
                      )}
                      {subjects.find((subject) => subject.id === field.value)?.name ||
                        "Select a subject"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <Circle size={16} color={subject.color} fill={subject.color} />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
