import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Option {
  value: string;
  label: string;
}

export type FormSelectProps<T extends Option> = {
  name: string;
  label?: string;
  options: T[];
  placeholder?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  renderSelectItem?: (item: T) => React.ReactNode;
};

export default function FormSelect<T extends Option>({
  name,
  label,
  className,
  placeholder,
  options = [],
  loading = false,
  disabled = false,
  renderSelectItem,
}: FormSelectProps<T>) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {renderSelectItem ? renderSelectItem(option) : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription />
            <FormMessage />
          </FormItem>
        );
      }}
      disabled={disabled}
    />
  );
}
