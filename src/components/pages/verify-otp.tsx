import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useGetOtp, useVerifyOtp } from "@/hooks/react-query/useAuth";
import useCountdown from "@/hooks/use-countdown";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your OTP must be 6 characters.",
  }),
});

type FormInputs = z.infer<typeof formSchema>;

export default function VerifyOtpPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { email, action } = useSearch({
    strict: false,
  });
  const verifyOtpMutation = useVerifyOtp();
  const getOtp = useGetOtp();
  const navigate = useNavigate();
  const { time, timeLeft, resume, restart } = useCountdown(5 * 60);

  const onSubmit = (data: FormInputs) => {
    verifyOtpMutation.mutate({
      email,
      otp: data.otp,
      action,
    });
  };

  useEffect(() => {
    resume();
  }, []);

  useEffect(() => {
    if (!email) navigate({ to: "/log-in" });
  }, [email, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Verify your OTP</CardTitle>
        <CardDescription className="text-center">
          <p>An OTP has been sent to your email {email}.</p>
          <p>Enter the 6-digit code to the input below.</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid place-items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-2"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Verify OTP
            </Button>
            <div className="text-center text-sm">
              Don't receive OTP?&nbsp;
              <a
                className="font-bold hover:cursor-pointer"
                onClick={() => {
                  if (timeLeft > 0) return;
                  restart();
                  getOtp.mutate({
                    email,
                    action,
                  });
                }}
              >
                Resend after {time}
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
