"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { businessSignUpAction } from "@/app/actions/auth-actions";
import { BusinessSignUpInputSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { useAction } from "@/hooks/use-action";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { execute, form, pending } = useAction({
    action: businessSignUpAction,

    formSchema: BusinessSignUpInputSchema,
    defaultValues,
    options: {
      showToasts: true,
      onSuccess: ({ isAdmin, hasBusiness }) => {
        if (isAdmin) router.push("/admin");
        else if (hasBusiness) router.push("/dashboard");
        else router.push("/auth/business-setup");
      },
    },
  });

  return (
    <form id="signup-form" className="space-y-4" onSubmit={execute}>
      <FieldGroup>
        {/* Nombre */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre Completo</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                placeholder="Juan Pérez"
                aria-invalid={fieldState.invalid}
                disabled={pending}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Contraseña */}
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
                  type={showPassword.password ? "text" : "password"}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  disabled={pending}
                />
                <Button
                  aria-label={
                    showPassword.password
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  disabled={pending}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
                  }
                >
                  {showPassword.password ? (
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

        {/* Confirmar Contraseña */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirmar Contraseña</FieldLabel>
              <InputGroup>
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  disabled={pending}
                />
                <Button
                  aria-label={
                    showPassword.confirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  disabled={pending}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                >
                  {showPassword.confirmPassword ? (
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
      </FieldGroup>

      {/* Botones */}
      <Field orientation="horizontal">
        <Button
          type="reset"
          variant="outline"
          onClick={() => form.reset()}
          disabled={pending}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={pending} form="signup-form">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Cuenta
        </Button>
      </Field>
    </form>
  );
}
