import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useGetOtp } from "@/hooks/react-query/useAuth";
import { EnumActionOTP } from "@/lib/enums";

const formSchema = z.object({
  email: z.string().email(),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });
  const sendOtpMutation = useGetOtp();
  const navigate = useNavigate();

  function onSubmit(data: FormInputs) {
    sendOtpMutation.mutate(
      {
        email: data.email,
        action: EnumActionOTP.resetPassword,
      },
      {
        onSuccess: () => {
          navigate({
            to: "/verify-otp",
            search: {
              email: data.email,
              action: EnumActionOTP.resetPassword,
            },
          });
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <Link
          to="/log-in"
          className="mb-8 inline-flex items-center gap-3 text-sm text-muted-foreground"
        >
          <MoveLeft size={16} />
          Back to log in
        </Link>
        <CardTitle className="text-center text-2xl">Forgot password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="example@gmail.com"
                      error={Boolean(form.formState.errors.email)}
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Send OTP
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
