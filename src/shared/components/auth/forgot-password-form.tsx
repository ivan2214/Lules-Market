"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import pathsConfig from "@/config/paths.config";
import { env } from "@/env/client";
import { requestPasswordReset } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  type ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/shared/validators/auth";
import { typeboxValidator } from "@/shared/validators/form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { AuthError } from "./auth-error";
import { AuthSuccess } from "./auth-success";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: typeboxValidator(forgotPasswordSchema),
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    startTransition(async () => {
      await requestPasswordReset(
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {error && <AuthError error={error} />}
      {success && <AuthSuccess message={success} />}
      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="example@gmail.com"
                autoComplete="email"
              />
              <FieldDescription>
                Introduce tu correo electrónico con el que te registraste
              </FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {pending ? "Restableciendo contraseña..." : "Restablecer contraseña"}
      </Button>
    </form>
  );
}
