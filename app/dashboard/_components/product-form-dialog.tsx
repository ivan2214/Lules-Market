"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import type React from "react";
import { type HTMLAttributes, useState } from "react";
import { Controller, Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ProductCreateInput,
  ProductCreateSchema,
  type ProductUpdateInput,
  ProductUpdateSchema,
} from "@/app/router/schemas";
import { Button } from "@/app/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/shared/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/shared/components/ui/field";
import { Input } from "@/app/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select";
import { Switch } from "@/app/shared/components/ui/switch";
import { Textarea } from "@/app/shared/components/ui/textarea";
import { Uploader } from "@/app/shared/components/uploader/uploader";
import type { CategoryWithRelations, ProductWithRelations } from "@/db/types";
import { orpcTanstack } from "@/lib/orpc";

interface ProductFormDialogProps {
  canFeature: boolean;
  product?: ProductWithRelations;
  trigger?: React.ReactNode;
  className?: HTMLAttributes<"button">["className"];
  isViewMode?: boolean;
  categories: CategoryWithRelations[];
}

export function ProductFormDialog({
  product,
  trigger,
  className,
  isViewMode = false,
  categories,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const createProductMutation = useMutation(
    orpcTanstack.products.createProduct.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Producto "${data.product.name}" creado exitosamente!`);

        // Invalidate channel queries to refetch the list
        queryClient.invalidateQueries({
          queryKey: orpcTanstack.products.listAllProducts.queryKey(),
        });
      },
      onError: () => {
        // Generic error fallback
        toast.error("Error al crear el producto. Por favor, intenta de nuevo.");
      },
    }),
  );

  const updateProductMutation = useMutation(
    orpcTanstack.products.updateProduct.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Producto "${data.product.name}" actualizado exitosamente!`,
        );

        // Invalidate channel queries to refetch the list
        queryClient.invalidateQueries({
          queryKey: orpcTanstack.products.listAllProducts.queryKey(),
        });
      },
      onError: () => {
        // Generic error fallback
        toast.error(
          "Error al actualizar el producto. Por favor, intenta de nuevo.",
        );
      },
    }),
  );

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
              url: img.url,
              key: img.key,
              name: img.name ?? "",
              isMainImage: img.isMainImage,
              size: img.size ?? 0,
            })) ?? [],
          active: product.active,
          featured: product.featured,
        }
      : {
          name: "",
          description: "",
          price: 0,
          images: [],
          active: true,
          featured: false,
        };
  const schema = product ? ProductUpdateSchema : ProductCreateSchema;

  const form = useForm<ProductCreateInput | ProductUpdateInput>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const execute = form.handleSubmit((data) => {
    if (product) {
      updateProductMutation.mutate(data as ProductUpdateInput);
    } else {
      createProductMutation.mutate(data as ProductCreateInput);
    }
  });

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
              ? "Consulta la informaciÃ³n detallada de tu producto"
              : product
                ? "Actualiza la informaciÃ³n de tu producto"
                : "Completa los datos para crear un nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            aria-disabled={isViewMode}
            onSubmit={(e) => {
              e.preventDefault();
              if (isViewMode) return;
              execute();
            }}
            className="space-y-4"
          >
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

              {/* DescripciÃ³n */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>DescripciÃ³n</FieldLabel>
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

              {/* CategorÃ­a */}
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>CategorÃ­as</FieldLabel>
                    <FieldDescription>
                      Selecciona una o varias categorÃ­as
                    </FieldDescription>

                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={isViewMode || pending}
                    >
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Seleccionar categorÃ­as" />
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

              {/* Destacado */}
              <Controller
                name="featured"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={!!fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Destacado</FieldLabel>
                      <FieldDescription>
                        Destaca este producto en la lista de productos.
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

              {/* ImÃ¡genes */}
              <Controller
                name="images"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>ImÃ¡genes</FieldLabel>
                    <Uploader
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
                      placeholder="Sube 1 imagen o mÃ¡ximo 4"
                      maxSize={1024 * 1024 * 5}
                      maxFiles={4}
                      value={field.value}
                      disabled={isViewMode || pending}
                      aria-invalid={!!fieldState.invalid}
                    />
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
                    {pending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {product ? "Actualizar" : "Crear Producto"}
                  </Button>
                </Field>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
