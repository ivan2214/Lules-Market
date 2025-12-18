"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { onError, onSuccess } from "@orpc/client";
import { useServerAction } from "@orpc/react/hooks";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { businessSignInAction } from "@/app/actions/auth";
import { BusinessSignInInputSchema } from "@/app/schemas/auth";
import { Button } from "@/app/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/shared/components/ui/field";
import { Input } from "@/app/shared/components/ui/input";
import { InputGroup } from "@/app/shared/components/ui/input-group";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm({
    resolver: zodResolver(BusinessSignInInputSchema),
    defaultValues,
  });

  const { execute, isPending } = useServerAction(businessSignInAction, {
    interceptors: [
      // Manejo de éxito
      onSuccess((data) => {
        toast.success(data?.message);
        // Navegación según tipo de usuario
        if (data?.isAdmin) {
          router.push("/admin");
        } else if (data?.hasVerified && !data?.isAdmin) {
          router.push("/dashboard"); // Nota: Parece que debe ir a /auth/verify
        } else if (!data?.hasVerified && !data?.isAdmin) {
          router.push("/auth/verify");
        }

        form.reset();
      }),

      // Manejo de errores
      onError((error) => {
        toast.error(error?.message || "Error al iniciar sesión");
      }),
    ],
  });

  const action = () => {
    execute(form.getValues());
  };

  return (
    <form id="signin-form" className="space-y-4" action={action}>
      <FieldGroup>
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                placeholder="tu@email.com"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
              <InputGroup>
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <Button
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  disabled={isPending}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:text-primary/50"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </FieldGroup>

      {/* Botones */}
      <Field orientation="horizontal">
        <Button
          type="reset"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isPending}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isPending} form="signin-form">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar Sesión
        </Button>
      </Field>
    </form>
  );
}
