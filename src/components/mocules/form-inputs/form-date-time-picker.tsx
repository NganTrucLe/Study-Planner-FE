import { useFormContext } from "react-hook-form";

import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { isDate } from "date-fns";

export type FormTextAreaProps = {
  name: string;
  label?: string;
  className?: string;
};

export default function FormDateTimePicker({ name, label, className }: FormTextAreaProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <DateTimePicker
            value={isDate(field.value) ? field.value : new Date(field.value)}
            onChange={field.onChange}
          />
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
