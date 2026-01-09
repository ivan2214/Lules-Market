"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

const updateAccountFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export function UpdateAccountDetailsForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(updateAccountFormSchema),
  });

  async function onSubmit(data: z.infer<typeof updateAccountFormSchema>) {
    const { name } = data;
    startTransition(async () => {
      await authClient.updateUser(
        {
          name,
        },
        {
          onSuccess: () => {
            toast.success("Account details updated successfully");
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
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Update your account details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={pending} className="w-fit">
                Update Account
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
