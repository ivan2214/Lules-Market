"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, type Resolver, useForm } from "react-hook-form";
import z from "zod";
import TagsField from "@/components/tags-field";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Plan, PlanInsert, PlanType } from "@/db/types";
import { orpcTanstack } from "@/lib/orpc";

export const planFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  type: z.enum(["FREE", "BASIC", "PREMIUM"] as PlanType[]),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  discount: z.coerce
    .number()
    .min(0, "El descuento debe ser mayor o igual a 0")
    .optional(),
  maxProducts: z.coerce
    .number()
    .min(0, "El número máximo de productos debe ser mayor o igual a 0"),
  maxImages: z.coerce
    .number()
    .min(0, "El número máximo de imágenes debe ser mayor o igual a 0"),
  features: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos una característica"),
  hasStatistics: z.boolean().optional(),
  canFeatureProducts: z.boolean().optional(),
  isActive: z.boolean().optional(),
}) satisfies z.ZodType<PlanInsert>;

export const PlanForm = ({ selectedPlan }: { selectedPlan?: Plan | null }) => {
  const defaultValues = selectedPlan || {
    name: "",
    type: "FREE",
    description: "",
    price: 0,
    maxProducts: 0,
    maxImages: 0,
    features: [],
    discount: 0,
    canFeatureProducts: false,
    hasStatistics: false,
    isActive: false,
  };

  const form = useForm<PlanInsert>({
    resolver: zodResolver(planFormSchema) as Resolver<PlanInsert>,
    defaultValues,
  });

  const { mutate, isPending } = useMutation(
    orpcTanstack.admin.plans.createPlan.mutationOptions({
      onSuccess: () => {
        form.reset();
      },
    }),
  );

  const onSubmit = (data: PlanInsert) => {
    mutate(data);
  };

  return (
    <form
      id="plan-create"
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-name">Nombre</FieldLabel>
              <Input
                {...field}
                id="plan-create-name"
                aria-invalid={fieldState.invalid}
                placeholder="Nombre del plan"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              orientation="responsive"
              data-invalid={fieldState.invalid}
              className="grid grid-cols-1 gap-2"
            >
              <FieldContent>
                <FieldLabel htmlFor="plan-create-type">Tipo</FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="plan-create-type"
                  aria-invalid={fieldState.invalid}
                  className="min-w-[120px]"
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-description">
                Descripción
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="plan-create-description"
                  placeholder="Descripción del plan"
                  rows={4}
                  className="min-h-20 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldSeparator />

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-price">Precio</FieldLabel>
              <Input
                {...field}
                id="plan-create-price"
                aria-invalid={fieldState.invalid}
                placeholder="Precio del plan"
                type="number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="discount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-discount">Descuento</FieldLabel>
              <Input
                {...field}
                id="plan-create-discount"
                aria-invalid={fieldState.invalid}
                placeholder="Descuento del plan ejemplo 10%"
                type="number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="maxProducts"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-max-products">
                Maximo de Productos
              </FieldLabel>
              <Input
                {...field}
                id="plan-create-max-products"
                aria-invalid={fieldState.invalid}
                placeholder="Maximo de Productos"
                type="number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="maxImages"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-max-images">
                Maximo de Imagenes
              </FieldLabel>
              <Input
                {...field}
                id="plan-create-max-images"
                aria-invalid={fieldState.invalid}
                placeholder="Maximo de Imagenes"
                type="number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldSeparator />

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="hasStatistics"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="plan-create-has-statistics">
                  Estadísticas
                </FieldLabel>
                <FieldDescription>
                  Habilitar estadísticas para este plan.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id="plan-create-has-statistics"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />
        <Controller
          name="canFeatureProducts"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="plan-create-can-feature-products">
                  Destacar Productos
                </FieldLabel>
                <FieldDescription>
                  Habilitar la posibilidad de destacar productos en este plan.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id="plan-create-can-feature-products"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="features"
          control={form.control}
          render={({ field }) => (
            <TagsField
              id="plan-create-features"
              label="Características"
              placeholder="Agregar característica"
              description="Características del plan"
              field={field}
            />
          )}
        />
      </FieldGroup>
      <DialogFooter>
        <Field>
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit">
            Guardar
          </Button>
        </Field>
      </DialogFooter>
    </form>
  );
};
