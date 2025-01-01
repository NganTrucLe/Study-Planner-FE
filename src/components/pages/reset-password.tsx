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
import { Link, useLocation } from "@tanstack/react-router";
import { Loader2, MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/react-query/useAuth";

const formSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      return ctx.addIssue({
        message: "Passwords do not match",
        path: ["confirmPassword"],
        code: "custom",
      });
    }
    return true;
  });

type FormInputs = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });
  const state = useLocation().state as { accessToken?: string };
  const resetPassword = useResetPassword();
  function onSubmit(data: FormInputs) {
    if (state.accessToken) {
      resetPassword.mutate({
        newPassword: data.newPassword,
        accessToken: state.accessToken,
      });
    }
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      error={Boolean(form.formState.errors.newPassword)}
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      error={Boolean(form.formState.errors.confirmPassword)}
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
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Reset password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
