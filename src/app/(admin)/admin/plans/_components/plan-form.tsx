"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, type Resolver, useForm } from "react-hook-form";
import type { Plan, PlanInsert } from "@/db/types";
import type { PlanFormInput } from "@/features/(admin)/admin/_types";
import { PlanFormSchema } from "@/features/(admin)/admin/_validations";
import { orpcTanstack } from "@/lib/orpc";
import TagsField from "@/shared/components/tags-field";
import { Button } from "@/shared/components/ui/button";
import { DialogClose, DialogFooter } from "@/shared/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";

export const PlanForm = ({ selectedPlan }: { selectedPlan?: Plan | null }) => {
  const defaultValues: PlanInsert = selectedPlan ?? {
    name: "",
    type: "FREE",
    description: "",
    price: 0,
    maxProducts: 0,
    maxImagesPerProduct: 0,
    features: [],
    details: {
      products: "",
      images: "",
      priority: "",
    },
    popular: false,
    discount: 0,

    hasStatistics: false,
    isActive: false,
  };

  const form = useForm<PlanFormInput>({
    resolver: zodResolver(PlanFormSchema) as Resolver<PlanInsert>,
    defaultValues,
  });

  const { mutate, isPending } = useMutation(
    orpcTanstack.admin.createPlan.mutationOptions({
      onSuccess: () => {
        form.reset();
      },
    }),
  );

  return (
    <form
      id="plan-create"
      action={() => mutate(form.getValues())}
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
          name="maxImagesPerProduct"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-max-images">
                Maximo de Imagenes por Producto
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

      <FieldGroup className="grid grid-cols-3 gap-4">
        <Controller
          name="details.products"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-details-products">
                Detalles: Productos
              </FieldLabel>
              <Input
                {...field}
                id="plan-create-details-products"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: 10, 50, Ilimitados"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="details.images"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-details-images">
                Detalles: Imágenes
              </FieldLabel>
              <Input
                {...field}
                id="plan-create-details-images"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: 1 por producto"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="details.priority"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="plan-create-details-priority">
                Detalles: Prioridad
              </FieldLabel>
              <Input
                {...field}
                id="plan-create-details-priority"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Estándar, Alta"
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
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="popular"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="plan-create-popular">Popular</FieldLabel>
                <FieldDescription>
                  Marcar este plan como popular para resaltarlo.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id="plan-create-popular"
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
