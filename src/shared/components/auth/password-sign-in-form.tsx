"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import pathsConfig from "@/config/paths.config";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { type SignInSchema, signInSchema } from "@/shared/validators/auth";
import { AuthError } from "./auth-error";

export function PasswordSignInForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchema) => {
    startTransition(async () => {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          callbackURL: pathsConfig.app.home,
        },
        {
          onSuccess: (context) => {
            setError(undefined);
            if (context.data.twoFactorRedirect) {
              router.push(pathsConfig.auth.twoFactor);
            }
          },
          onError: ({ error }) => {
            setError(error.message);
          },
        },
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <AuthError error={error} />}
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="john.doe@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="rememberMe"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Checkbox {...field} defaultChecked={field.value} />
                  <FormLabel>Recordarme</FormLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}
