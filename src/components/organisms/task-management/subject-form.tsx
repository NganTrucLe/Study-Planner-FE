import React from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui";
import { subjectColors } from "./constants";
import { EnumTaskColor } from "@/lib/enums";

const formSchema = z.object({
  name: z.string().min(1, { message: "Subject name is required." }),
  color: z.nativeEnum(EnumTaskColor),
});

type FormInputs = z.infer<typeof formSchema>;

interface SubjectFormProps {
  onCreate: (data: FormInputs) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onCreate }) => {
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: EnumTaskColor.RED,
    },
  });

  const onSubmit = (data: FormInputs) => {
    onCreate(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter subject name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full rounded border p-2">
                    <div className="flex items-center gap-2">
                      <Circle
                        size={16}
                        color={subjectColors.find((color) => color.value === field.value)?.color}
                        fill={subjectColors.find((color) => color.value === field.value)?.color}
                      />
                      {subjectColors.find((color) => color.value === field.value)?.label}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {subjectColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <Circle size={16} color={color.color} fill={color.color} />
                          {color.label}
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
            Save
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default SubjectForm;
