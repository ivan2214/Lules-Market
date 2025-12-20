"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

export function BusinessSocialInfo() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Redes Sociales</h3>
      <FieldGroup className="grid gap-6 md:grid-cols-3">
        {["whatsapp", "instagram", "facebook"].map((name) => (
          <Controller
            key={name}
            name={name as "whatsapp" | "instagram" | "facebook"}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.invalid}>
                <FieldLabel className="capitalize">{name}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={!!fieldState.invalid}
                  placeholder={
                    name === "whatsapp" ? "+54 11 1234-5678" : "@minegocio"
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}
      </FieldGroup>
    </div>
  );
}
