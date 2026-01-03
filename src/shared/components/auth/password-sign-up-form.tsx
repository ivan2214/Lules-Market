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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { AuthError } from "./auth-error";
import { AuthSuccess } from "./auth-success";
import { OAuthProviders } from "./oauth-providers";

export function PasswordSignUpForm() {
  const [isBusiness, setIsBusiness] = useState(false);

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
          callbackURL: isBusiness
            ? "/auth/business-setup"
            : env.NEXT_PUBLIC_APP_URL + pathsConfig.app.home,
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
    <>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
        <span className="relative z-10 bg-card px-2 text-muted-foreground">
          O continuar con
        </span>
      </div>
      <OAuthProviders isBusiness={isBusiness} />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
        <span className="relative z-10 bg-card px-2 text-muted-foreground">
          Con correo y contraseña
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={isBusiness}
          onCheckedChange={(checked) => setIsBusiness(!!checked)}
        />
        <Label htmlFor="terms">Registrarme como comercio</Label>
      </div>
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
    </>
  );
}
