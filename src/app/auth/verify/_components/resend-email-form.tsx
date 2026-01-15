"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { resendEmailSchema } from "../schemas/resend-email.schema";

interface ResendEmailFormProps {
  defaultEmail?: string;
  onSuccess?: () => void;
}

export function ResendEmailForm({
  defaultEmail = "",
  onSuccess,
}: ResendEmailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const { error: resendError } = await authClient.sendVerificationEmail({
          email: value.email,
        });

        if (resendError) {
          setError(resendError.message || "Error al enviar el correo");
        } else {
          setSubmitted(true);
          onSuccess?.();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error de conexión");
      } finally {
        setIsSubmitting(false);
      }
    },
    validators: {
      onSubmit: resendEmailSchema,
      onChange: resendEmailSchema,
    },
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <Send className="h-6 w-6 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm">Correo enviado</p>
          <p className="text-muted-foreground text-xs">
            Revisa tu bandeja de entrada
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSubmitted(false)}
          className="text-xs"
        >
          Enviar otro correo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1 text-center">
        <p className="font-medium text-sm">¿No recibiste el correo?</p>
        <p className="text-muted-foreground text-xs">
          Ingresa tu email para enviar otro enlace de verificación
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="email"
          validators={{
            onChange: resendEmailSchema.shape.email,
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="sr-only">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="tu@email.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        {error && (
          <p className="text-center text-destructive text-xs">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Reenviar correo
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
