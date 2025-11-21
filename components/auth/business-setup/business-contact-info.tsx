"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function BusinessContactInfo() {
  const { control } = useFormContext();

  return (
    <FieldGroup className="grid gap-6 md:grid-cols-2">
      {["address", "phone", "website"].map((name) => (
        <Controller
          key={name}
          name={name as "address" | "phone" | "website"}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.invalid}>
              <FieldLabel className="capitalize">{name}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={!!fieldState.invalid}
                placeholder={
                  {
                    address: "Calle 123, Ciudad",
                    phone: "+54 11 1234-5678",
                    email: "contacto@negocio.com",
                    website: "https://minegocio.com",
                  }[name]
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      ))}
    </FieldGroup>
  );
}
