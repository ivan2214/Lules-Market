"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import type React from "react";
import { type HTMLAttributes, useState } from "react";
import type { Category, CurrentPlan } from "@/db/types";
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
import type { ProductDto } from "@/shared/utils/dto";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "@/shared/validators/product";
// ... (skip lines)
import type { ProductCreateInput, ProductUpdateInput } from "../_types";

interface ProductFormDialogProps {
  product?: ProductDto;
  trigger?: React.ReactNode;
  className?: HTMLAttributes<"button">["className"];
  isViewMode?: boolean;
  categories: Category[];
  maxImagesPerProduct: CurrentPlan["imagesUsed"];
  disabled?: boolean;
}

export function ProductFormDialog({
  product,
  trigger,
  className,
  isViewMode = false,
  categories,
  maxImagesPerProduct: _maxImagesPerProduct,
  disabled = false,
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

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
      onSubmit: schema,
      onBlur: schema,
    },
    onSubmit(props) {
      const data = props.value;
      if (isViewMode) return;
      if (product) {
        updateProductMutation.mutate(data as ProductUpdateInput);
      } else {
        createProductMutation.mutate(data as ProductCreateInput);
      }
    },
  });

  const pending =
    createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
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

        <form
          aria-disabled={isViewMode}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Nombre */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isViewMode || pending}
                      placeholder="Nombre del producto"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Descripción */}
            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isViewMode || pending}
                      placeholder="Describe el producto"
                    />
                    <FieldDescription>Describe el producto</FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Precio */}
            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Precio</FieldLabel>
                    <Input
                      type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="Precio del producto"
                      aria-invalid={isInvalid}
                      disabled={isViewMode || pending}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Categoría */}
            <form.Field name="category">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                    <FieldDescription>
                      Selecciona una o varias categorías
                    </FieldDescription>

                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
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
                                checked={field.state.value === value}
                                readOnly
                              />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Activo */}
            <form.Field name="active">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Activo</FieldLabel>
                      <FieldDescription>
                        Activa este producto para que sea visible en la lista.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Switch
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                      aria-invalid={isInvalid}
                      disabled={isViewMode || pending}
                    />
                  </Field>
                );
              }}
            </form.Field>

            {/* Imágenes */}
            <form.Field name="images">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
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
