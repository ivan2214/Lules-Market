"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { resetPassword } from "@/lib/auth/auth-client";
import { AuthError } from "@/shared/components/auth/auth-error";
import { AuthSuccess } from "@/shared/components/auth/auth-success";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  type ResetPasswordSchema,
  resetPasswordSchema,
} from "@/shared/validators/auth";
import { typeboxValidator } from "@/shared/validators/form";

export function ResetPasswordForm({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: typeboxValidator(resetPasswordSchema),
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    startTransition(async () => {
      await resetPassword(
        {
          newPassword: data.password,
          token,
        },
        {
          onError: ({ error: err }) => {
            setError(err.message);
            setSuccess(undefined);
          },
          onSuccess: () => {
            setError(undefined);
            setSuccess("Password reset successfully");
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
      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="**********"
                autoComplete="off"
                type="password"
              />

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
      <form.Field name="confirmPassword">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Confirmar contraseña</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="**********"
                autoComplete="off"
                type="password"
              />

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
