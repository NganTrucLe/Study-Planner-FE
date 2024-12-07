import { format } from "date-fns";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useUpdateUserProfile, useUserProfile } from "@/hooks/react-query/useUsers";
import { cn } from "@/lib/utils";
import { EnumGender } from "@/lib/enums";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import FormSelect from "@/components/mocules/form-inputs/form-select";

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, "Username must be at least 1 characters long"),
  dob: z.date().or(z.string()).optional(),
  gender: z.nativeEnum(EnumGender).optional(),
});

type FormInputs = z.infer<typeof formSchema>;

function captializeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ProfilePage() {
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });
  const { data, isLoading, isSuccess } = useUserProfile();
  const profileMutation = useUpdateUserProfile();

  function onSubmit(data: FormInputs) {
    console.log(data);
    profileMutation.mutate({
      username: data.username,
      gender: data.gender,
      // dob: data.dob, //Invalid DOB type
    });
  }

  useEffect(() => {
    if (isSuccess && data) {
      form.reset({
        email: data.email,
        username: data.username ?? "",
        dob: data.dob ? new Date(data.dob) : "",
        gender: data.gender ? data.gender : undefined,
      });
    }
  }, [data, isSuccess]);

  return (
    <>
      {isLoading ? (
        <Loader2 className="mx-auto size-12 animate-spin" />
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your email"
                        error={Boolean(form.formState.errors.email)}
                        {...field}
                        onChange={field.onChange}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        error={Boolean(form.formState.errors.username)}
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
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <span>{format(field.value, "dd/MM/yyyy")}</span>
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value instanceof Date ? field.value : undefined}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSelect
                name="gender"
                label="Gender"
                placeholder="Choose your gender"
                options={Object.values(EnumGender).map((item) => ({
                  label: captializeFirstLetter(item),
                  value: item,
                }))}
                loading={isLoading}
              />
              <Button type="submit" className="mt-4 w-fit">
                Save changes
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}
