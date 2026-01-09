"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import pathsConfig from "@/config/paths.config";
import { env } from "@/env/client";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  type ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/shared/validators/auth";

import { AuthError } from "./auth-error";
import { AuthSuccess } from "./auth-success";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<ForgotPasswordSchema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: env.NEXT_PUBLIC_APP_URL + pathsConfig.auth.resetPassword,
        },
        {
          onError: ({ error: err }) => {
            setError(err.message);
            setSuccess(undefined);
          },
          onSuccess: () => {
            setError(undefined);
            setSuccess("Check your inbox for the reset link");
          },
        },
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <AuthError error={error} />}
        {success && <AuthSuccess message={success} />}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Restableciendo contraseña..." : "Restablecer contraseña"}
        </Button>
      </form>
    </Form>
  );
}
