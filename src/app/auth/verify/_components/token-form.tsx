"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Key, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { tokenSchema } from "../schemas/resend-email.schema";

interface TokenFormProps {
  onVerificationComplete?: (success: boolean) => void;
  onStatusChange?: (
    status: "verifying" | "verified" | "error",
    error?: string,
  ) => void;
}

export function TokenForm({
  onVerificationComplete,
  onStatusChange,
}: TokenFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      token: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      onStatusChange?.("verifying");

      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token: value.token,
          },
        });

        if (error) {
          onStatusChange?.(
            "error",
            error.message || "Error al verificar el token",
          );
          onVerificationComplete?.(false);
        } else {
          onStatusChange?.("verified");
          onVerificationComplete?.(true);
          router.refresh();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error de conexión";
        onStatusChange?.("error", errorMessage);
        onVerificationComplete?.(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    validators: {
      onSubmit: tokenSchema,
      onChange: tokenSchema,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1 text-center">
        <p className="font-medium text-sm">
          ¿Tienes un código de verificación?
        </p>
        <p className="text-muted-foreground text-xs">
          Ingresa el código que recibiste en tu correo
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="token">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Código de verificación
                </FieldLabel>
                <div className="relative">
                  <Key className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Ingresa tu código"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="pl-10 font-mono tracking-wider"
                    disabled={isSubmitting}
                    autoComplete="one-time-code"
                  />
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Verificar código
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
