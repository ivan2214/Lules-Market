"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BusinessBasicInfoProps {
  categories: { label: string; value: string }[];
  pending: boolean;
}

export function BusinessBasicInfo({
  categories,
  pending,
}: BusinessBasicInfoProps) {
  const { control } = useFormContext();

  return (
    <>
      {/* Categoría */}
      <Controller
        name="category"
        control={control}
        render={({ field, fieldState }) => (
          <Field orientation="vertical" data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
              <FieldDescription>
                Selecciona la categoría del negocio
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>

            <Select
              value={field.value || ""}
              onValueChange={(val) => field.onChange(val)}
              disabled={pending}
              aria-invalid={fieldState.invalid}
            >
              <SelectTrigger id="category" className="min-w-[120px]">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="none">Seleccionar categoría</SelectItem>
                <SelectSeparator />
                {categories.map(({ label, value }) => (
                  <SelectItem key={value} value={value.toLowerCase()}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Descripción */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Ej: Vendemos pan artesanal todos los días..."
            />
            <FieldDescription>Describe brevemente tu negocio.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
