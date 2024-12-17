import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type DateTimePickerFormProps = {
  name: string;
  label: string;
};

export default function DateTimePickerForm({ name, label }: DateTimePickerFormProps) {
  const form = useFormContext();

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue(name, date);
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = form.getValues(name) || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue(name, newDate);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "MM/dd/yyyy hh:mm aa")
                  ) : (
                    <span>MM/DD/YYYY hh:mm aa</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex p-2 sm:flex-col">
                      {Array.from({ length: 12 }, (_, i) => i + 1)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={
                              field.value && field.value.getHours() % 12 === hour % 12
                                ? "default"
                                : "ghost"
                            }
                            className="aspect-square shrink-0 sm:w-full"
                            onClick={() => handleTimeChange("hour", hour.toString())}
                          >
                            {hour}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex p-2 sm:flex-col">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                        <Button
                          key={minute}
                          size="icon"
                          variant={
                            field.value && field.value.getMinutes() === minute ? "default" : "ghost"
                          }
                          className="aspect-square shrink-0 sm:w-full"
                          onClick={() => handleTimeChange("minute", minute.toString())}
                        >
                          {minute.toString().padStart(2, "0")}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="">
                    <div className="flex p-2 sm:flex-col">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            field.value &&
                            ((ampm === "AM" && field.value.getHours() < 12) ||
                              (ampm === "PM" && field.value.getHours() >= 12))
                              ? "default"
                              : "ghost"
                          }
                          className="aspect-square shrink-0 sm:w-full"
                          onClick={() => handleTimeChange("ampm", ampm)}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
