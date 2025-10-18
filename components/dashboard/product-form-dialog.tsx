"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import type React from "react";
import { type HTMLAttributes, startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/use-action";
import { createProduct, updateProduct } from "@/lib/actions/product-actions";
import { CATEGORIES } from "@/lib/constants";
import {
  type CreateOrUpdateProductSchemaInput,
  CreateProductSchema,
  UpdateProductSchema,
} from "@/schemas/product";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Uploader } from "../uploader";

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
  canFeature = false,
  product,
  trigger,
  className,
  isViewMode = false,
}: ProductFormDialogProps) {
  console.log(product);

  const schema = product
    ? UpdateProductSchema.extend({ mode: z.literal("update") })
    : CreateProductSchema.extend({ mode: z.literal("create") });
  const form = useForm<CreateOrUpdateProductSchemaInput>({
    // biome-ignore lint/suspicious/noExplicitAny: <reason>
    resolver: zodResolver(schema as any),
    defaultValues: product?.id
      ? {
          mode: "update",
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
          mode: "create",
          name: "",
          description: "",
          price: 0,
          category: "",
          images: [],
          active: true,
          featured: false,
        },
  });

  const { execute, pending } = useAction(
    product ? updateProduct : createProduct,
    {},
    {
      showToasts: true,
      onSuccess() {
        setOpen(false);
      },
    },
  );
  const [open, setOpen] = useState(false);

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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
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
            onSubmit={form.handleSubmit(() => {
              if (isViewMode) {
                return;
              }

              const data = form.getValues();

              startTransition(() => {
                execute({
                  ...data,
                  productId:
                    "productId" in data ? data.productId : (product?.id ?? ""),
                });
              });
            })}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                disabled={isViewMode}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nombre del producto *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa el nombre del producto"
                        disabled={isViewMode}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isViewMode}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isViewMode}
                        className="resize-none"
                        placeholder="Describe tu producto..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  disabled={isViewMode}
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isViewMode}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isViewMode}
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría *</FormLabel>
                      <Select
                        disabled={isViewMode}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="images"
                disabled={isViewMode}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="images">Imágenes</FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={(value) => {
                          field.onChange(value);
                          console.log("Imagenes actualizadas", value);
                        }}
                        variant="compact"
                        preview="grid"
                        placeholder="Sube 1 imagen o máximo 4"
                        maxSize={1024 * 1024 * 5}
                        maxFiles={4}
                        value={field.value}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {product && (
                <div className="flex items-center gap-4">
                  <FormField
                    disabled={isViewMode}
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producto activo</FormLabel>
                        <FormControl>
                          <Checkbox
                            disabled={isViewMode}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {canFeature && (
                    <FormField
                      disabled={isViewMode}
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destacar producto</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>

            {!isViewMode && (
              <DialogFooter>
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
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
