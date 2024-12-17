import React from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { subjectColors, SubjectOption } from "@/lib/constants";
import { EnumTaskColor } from "@/lib/enums";
import FormSelect from "@/components/mocules/form-inputs/form-select";

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
        <FormSelect
          name="color"
          label="Color"
          options={subjectColors}
          renderSelectItem={({ label, color }: SubjectOption) => (
            <div className="inline-flex items-center">
              <span
                className="mr-2 inline-block size-4 rounded-full"
                style={{ background: color }}
              ></span>
              {label}
            </div>
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
