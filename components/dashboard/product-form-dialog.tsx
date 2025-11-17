"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { type HTMLAttributes, useMemo, useState } from "react";
import { Controller, Form } from "react-hook-form";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/product.action";
import {
  ProductCreateInputSchema,
  type ProductDTO,
} from "@/app/data/product/product.dto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/use-action";
import { CATEGORIES } from "@/lib/constants";
import { Uploader } from "../uploader/uploader";

interface ProductFormDialogProps {
  canFeature: boolean;
  product?: ProductDTO;
  trigger?: React.ReactNode;
  className?: HTMLAttributes<"button">["className"];
  isViewMode?: boolean;
}

export function ProductFormDialog({
  product,
  trigger,
  className,
  isViewMode = false,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const actionOptions = useMemo(
    () => ({
      showToasts: true,
      onSuccess() {
        setOpen(false);
        router.refresh();
      },
    }),
    [router],
  );

  const action = product ? updateProductAction : createProductAction;

  const defaultValues = product?.id
    ? {
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price || 0,
        categories: product.category,
        images: product?.images?.map((img) => ({
          url: img.url,
          key: img.key,
          name: img.name ?? undefined,
          isMainImage: img.isMainImage,
          size: img.size ?? undefined,
        })),
        active: product.active,
        featured: product.featured,
      }
    : {
        name: "",
        description: "",
        price: 0,
        categories: [],
        images: [],
        active: true,
        featured: false,
      };

  const { execute, form, pending } = useAction({
    action,
    formSchema: ProductCreateInputSchema,
    defaultValues,
    options: actionOptions,
  });

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
                    <FieldLabel htmlFor={field.name}>Categorías</FieldLabel>
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
                        <SelectValue placeholder="Seleccionar categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(category)}
                                readOnly
                              />
                              {category}
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

              {/* Imágenes */}
              <Controller
                name="images"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Imágenes</FieldLabel>
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
                      placeholder="Sube 1 imagen o máximo 4"
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
