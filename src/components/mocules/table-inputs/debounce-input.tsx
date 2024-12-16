import { Input, InputProps } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { InputHTMLAttributes, useEffect, useState } from "react";

type DebouncedInputProps = InputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    onChange: (value: string) => void;
    debounce?: number;
  };

export default function DebouncedInput({
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value, debounce);
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
