"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import type React from "react";
import { type HTMLAttributes, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  CategoryWithRelations,
  CurrentPlan,
  ProductWithRelations,
} from "@/db/types";
import { api } from "@/lib/eden";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "@/shared/validators/product";
import type { ProductCreateInput, ProductUpdateInput } from "../_types";

interface ProductFormDialogProps {
  product?: ProductWithRelations;
  trigger?: React.ReactNode;
  className?: HTMLAttributes<"button">["className"];
  isViewMode?: boolean;
  categories: CategoryWithRelations[];
  maxImagesPerProduct: CurrentPlan["imagesUsed"];
}

export function ProductFormDialog({
  product,
  trigger,
  className,
  isViewMode = false,
  categories,
  maxImagesPerProduct: _maxImagesPerProduct,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);

  const createProductMutation = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (data: ProductCreateInput) => api.products.private.post(data),
  });

  const updateProductMutation = useMutation({
    mutationKey: ["update-product"],
    mutationFn: (data: ProductUpdateInput) => api.products.private.put(data),
  });

  const defaultValues: Partial<ProductCreateInput | ProductUpdateInput> =
    product?.id
      ? {
          productId: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price || 0,
          category: product.category?.value || "",
          images:
            product?.images?.map((img) => ({
              key: img.key,
              isMainImage: img.isMainImage,
              file: [],
              objectKeys: [],
            })) ?? [],
          active: product.active,
        }
      : {
          name: "",
          description: "",
          price: 0,
          images: [],
          active: true,
        };
  const schema = product ? ProductUpdateSchema : ProductCreateSchema;

  const form = useForm<ProductCreateInput | ProductUpdateInput>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const execute = () => {
    const data = form.getValues();
    if (isViewMode) return;
    if (product) {
      updateProductMutation.mutate(data as ProductUpdateInput);
    } else {
      createProductMutation.mutate(data as ProductCreateInput);
    }
  };

  const pending =
    createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" className={className}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {isViewMode
              ? "Ver Producto"
              : product
                ? "Editar Producto"
                : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Consulta la información detallada de tu producto"
              : product
                ? "Actualiza la información de tu producto"
                : "Completa los datos para crear un nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <form aria-disabled={isViewMode} action={execute} className="space-y-4">
          <FieldGroup>
            {/* Nombre */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Nombre del producto"
                    aria-invalid={!!fieldState.invalid}
                    disabled={isViewMode || pending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Descripción */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe el producto"
                    className="min-h-[120px]"
                    aria-invalid={!!fieldState.invalid}
                    disabled={isViewMode || pending}
                  />
                  <FieldDescription>Describe el producto</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Precio */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Precio</FieldLabel>
                  <Input
                    type="number"
                    id={field.name}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Precio del producto"
                    aria-invalid={!!fieldState.invalid}
                    disabled={isViewMode || pending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Categoría */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                  <FieldDescription>
                    Selecciona una o varias categorías
                  </FieldDescription>

                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    disabled={isViewMode || pending}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(({ id, label, value }) => (
                        <SelectItem key={id} value={value}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.value === value}
                              readOnly
                            />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Activo */}
            <Controller
              name="active"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={!!fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Activo</FieldLabel>
                    <FieldDescription>
                      Activa este producto para que sea visible en la lista.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id={field.name}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={!!fieldState.invalid}
                    disabled={isViewMode || pending}
                  />
                </Field>
              )}
            />

            {/* Imágenes */}
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Imágenes</FieldLabel>
                  {/*       <Uploader
                    folder="products"
                    onChange={(value) => {
                      const images = (
                        Array.isArray(value) ? value : value ? [value] : []
                      ).map((file) => ({
                        url: file.url,
                        key: file.key,
                        name: file.name ?? undefined,
                        isMainImage: file.isMainImage ?? false,
                        size: file.size ?? undefined,
                      }));
                      field.onChange(images);
                    }}
                    placeholder={`Sube 1 imagen o máximo ${maxImagesPerProduct}`}
                    maxSize={1024 * 1024 * 5}
                    maxFiles={maxImagesPerProduct}
                    value={field.value}
                    disabled={isViewMode || pending}
                    aria-invalid={!!fieldState.invalid}
                  /> */}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {!isViewMode && (
            <DialogFooter>
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {product ? "Actualizar" : "Crear Producto"}
                </Button>
              </Field>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
