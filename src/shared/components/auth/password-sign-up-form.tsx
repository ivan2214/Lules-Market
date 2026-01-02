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
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { type SignUpSchema, signUpSchema } from "@/shared/validators/auth";
import { AuthError } from "./auth-error";
import { AuthSuccess } from "./auth-success";

export function PasswordSignUpForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<SignUpSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          name: data.email.split("@")[0],
          email: data.email,
          password: data.password,
          callbackURL: env.NEXT_PUBLIC_APP_URL + pathsConfig.app.home,
        },
        {
          onSuccess: () => {
            setError(undefined);
            setSuccess(
              "Account created successfully. Please check your email to verify your account.",
            );
          },
          onError: ({ error }) => {
            setError(error.message);
            setSuccess(undefined);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </Form>
  );
}
