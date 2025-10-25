"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { startTransition } from "react";
import { businessSignInAction } from "@/app/actions/auth-actions";
import { BusinessSignInInputSchema } from "@/app/schemas/auth";
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

export function SignInForm() {
  const { execute, pending } = useAction(
    businessSignInAction,
    {},
    {
      showToasts: true,
    },
  );

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: BusinessSignInInputSchema,
      onChange: BusinessSignInInputSchema,
      onBlur: BusinessSignInInputSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(() => {
        execute(value);
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
      id="signin-form"
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="tu@email.com"
                  type="email"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <InputGroup>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={isInvalid}
                    type="password"
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Field orientation="horizontal">
        <Button
          type="reset"
          variant="outline"
          onClick={() => form.reset()}
          disabled={pending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={pending} form="signin-form">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar Sesión
        </Button>
      </Field>
    </form>
  );
}
