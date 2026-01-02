"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import pathsConfig from "@/config/paths.config";
import { env } from "@/env/client";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

const updateEmailFormSchema = z.object({
  email: z.string().email().readonly(),
  new_email: z.string().email("Please enter a valid email address"),
});

export function UpdateAccountEmailForm({ email }: { email: string }) {
  const [pending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      email: email,
      new_email: "",
    },
    resolver: zodResolver(updateEmailFormSchema),
  });

  async function onSubmit(data: z.infer<typeof updateEmailFormSchema>) {
    const { new_email } = data;
    startTransition(async () => {
      await authClient.changeEmail(
        {
          newEmail: new_email,
          callbackURL: env.NEXT_PUBLIC_APP_URL + pathsConfig.app.account,
        },
        {
          onSuccess: () => {
            toast.success("Verification email sent");
            form.reset();
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Email</CardTitle>
        <CardDescription>Update your account email below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        type="email"
                        placeholder="m@example.com"
                      />
                    </FormControl>
                    <FormDescription>
                      This is your current email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="m@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={pending} className="w-fit">
                Update Email
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
