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
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useSignIn, useSignInWithGoogle } from "@/hooks/react-query/useAuth";

import GoogleLogo from "../mocules/logo/google";
import { Separator } from "../ui";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormInputs = z.infer<typeof formSchema>;

export default function LogInPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  const signInMutation = useSignIn();
  const signInWithGoogleMutation = useSignInWithGoogle();

  function onSubmit(data: FormInputs) {
    signInMutation.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your account information here, and click Log in.
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      error={Boolean(form.formState.errors.password)}
                      {...field}
                      type="password"
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="inline-flex justify-end">
              <Link to="/forgot-password" className="text-right text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="mt-2 flex flex-col gap-4">
              <Button
                type="submit"
                variant="default"
                className="mt-4 w-full bg-primary"
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending && (
                  <Loader2 className="mr-1 size-5 animate-spin text-white" />
                )}
                Log in
              </Button>
              <div className="flex w-full flex-row items-center gap-2">
                <Separator orientation="horizontal" className="flex-1" />
                <p>or</p>
                <Separator orientation="horizontal" className="flex-1" />
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={() => signInWithGoogleMutation.mutate()}
              >
                Sign in with&nbsp;
                <span>
                  <GoogleLogo />
                </span>
              </Button>
            </div>
            <div className="mt-8 text-center text-sm">
              Don't have account?&nbsp;
              <Link to="/sign-up" className="font-bold">
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
