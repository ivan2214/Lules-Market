"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { type HTMLAttributes, startTransition, useMemo, useState } from "react";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/product.action";
import {
  ProductCreateInputSchema,
  ProductUpdateInputSchema,
} from "@/app/data/product/product.dto";
import type { Image } from "@/app/generated/prisma";
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
  SelectSeparator,
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
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    category: string;
    images: Image[];
    active: boolean;
    featured: boolean;
  };
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

  const { execute, pending } = useAction(action, {}, actionOptions);

  const form = useForm({
    defaultValues: product?.id
      ? {
          productId: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price || 0,
          category: product.category,
          images: product.images.map((img) => ({
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
          category: "",
          images: [],
          active: true,
          featured: false,
        },
    // Elimina los validators de aquí
    onSubmit: ({ value }) => {
      console.log("submite en form");

      // Valida manualmente según el contexto
      const schema = product
        ? ProductUpdateInputSchema
        : ProductCreateInputSchema;

      const validation = schema.safeParse(value);

      if (!validation.success) {
        console.log("Invalid:", validation.error.issues);
        return;
      }

      const data =
        "productId" in value
          ? {
              ...value,
              productId: value.productId,
            }
          : { ...value };

      startTransition(() => {
        execute(data);
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
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

        <form
          id="product-form"
          aria-disabled={isViewMode}
          onSubmit={(e) => {
            e.preventDefault();
            if (isViewMode) return;
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
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
                      placeholder="Nombre del producto"
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
            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="product-form">Descripción</FieldLabel>
                    <Textarea
                      id="product-form"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Describe el producto"
                      className="min-h-[120px]"
                      disabled={isViewMode || pending}
                    />
                    <FieldDescription>Describe el producto</FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
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
            <form.Field name="category">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                      <FieldDescription>
                        Selecciona la categoría del producto
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      disabled={isViewMode || pending}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger
                        id="product-form"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="auto">
                          Seleccionar categoría
                        </SelectItem>
                        <SelectSeparator />
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="featured">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="product-form">Destacado</FieldLabel>
                      <FieldDescription>
                        Destaca este producto en la lista de productos.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Switch
                      id="product-form"
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
            <form.Field name="active">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="product-form">Activo</FieldLabel>
                      <FieldDescription>
                        Activa este producto para que sea visible en la lista de
                        productos.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Switch
                      id="product-form"
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
            <form.Field name="images">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Imagenes</FieldLabel>
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
                        field.handleChange(images);
                        console.log("Imagenes actualizadas", images);
                      }}
                      variant="compact"
                      placeholder="Sube 1 imagen o máximo 4"
                      maxSize={1024 * 1024 * 5}
                      maxFiles={4}
                      value={field.state.value}
                      disabled={isViewMode || pending || isInvalid}
                      aria-invalid={isInvalid}
                    />

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
