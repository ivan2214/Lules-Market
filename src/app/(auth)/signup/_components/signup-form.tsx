"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { onError, onSuccess } from "@orpc/client";
import { useServerAction } from "@orpc/react/hooks";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { businessSignUpAction } from "@/app/(auth)/_actions/auth-actions";
import type { BusinessSignUpInput } from "@/features/(auth)/_types";
import { BusinessSignUpInputSchema } from "@/features/(auth)/_validations";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { InputGroup } from "@/shared/components/ui/input-group";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // React Hook Form setup
  const form = useForm<BusinessSignUpInput>({
    resolver: zodResolver(BusinessSignUpInputSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // oRPC useServerAction hook
  const { execute, isPending } = useServerAction(businessSignUpAction, {
    interceptors: [
      // Manejo de éxito
      onSuccess((data) => {
        toast.success(data?.message);

        // Navegación según tipo de usuario
        if (data?.hasVerified && data?.isAdmin) {
          router.push("/admin");
        } else if (data?.hasVerified && !data?.isAdmin) {
          router.push("/admin");
        } else if (!data?.hasVerified && !data?.isAdmin) {
          router.push("/verify");
        }

        form.reset();
      }),

      // Manejo de errores
      onError((error) => {
        toast.error(error.message || "Error al crear la cuenta");
      }),
    ],
  });

  const action = () => {
    execute(form.getValues());
  };

  return (
    <form id="signup-form" className="space-y-4" action={action}>
      <FieldGroup>
        {/* Nombre */}
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Nombre Completo</FieldLabel>
          <Input
            id="name"
            placeholder="Juan Pérez"
            aria-invalid={!!form.formState.errors.name}
            disabled={isPending}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <FieldError errors={[form.formState.errors.name]} />
          )}
        </Field>

        {/* Email */}
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            aria-invalid={!!form.formState.errors.email}
            disabled={isPending}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <FieldError errors={[form.formState.errors.email]} />
          )}
        </Field>

        {/* Contraseña */}
        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword.password ? "text" : "password"}
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.password}
              disabled={isPending}
              {...form.register("password")}
            />
            <Button
              aria-label={
                showPassword.password
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              disabled={isPending}
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
          {form.formState.errors.password && (
            <FieldError errors={[form.formState.errors.password]} />
          )}
        </Field>

        {/* Confirmar Contraseña */}
        <Field data-invalid={!!form.formState.errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">
            Confirmar Contraseña
          </FieldLabel>
          <InputGroup>
            <Input
              id="confirmPassword"
              type={showPassword.confirmPassword ? "text" : "password"}
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.confirmPassword}
              disabled={isPending}
              {...form.register("confirmPassword")}
            />
            <Button
              aria-label={
                showPassword.confirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              disabled={isPending}
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
          {form.formState.errors.confirmPassword && (
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          )}
        </Field>
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

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Cuenta
        </Button>
      </Field>
    </form>
  );
}
