"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { createBusinessAction } from "@/app/actions/business-actions";
import { BusinessCreateInputSchema } from "@/app/data/business/business.dto";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/uploader/uploader";
import { useAction } from "@/hooks/use-action";
import { Form } from "../ui/form";

export function BusinessSetupForm({
  categories,
}: {
  categories: { label: string; value: string }[];
}) {
  const router = useRouter();

  const defaultValues = {
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    logo: {
      url: "",
      key: "",
      name: "",
      isMainImage: true,
      size: 0,
    },
    coverImage: {
      url: "",
      key: "",
      name: "",
      isMainImage: false,
      size: 0,
    },
  };

  const { execute, pending, form } = useAction({
    action: createBusinessAction,
    formSchema: BusinessCreateInputSchema,
    defaultValues,
    options: {
      showToasts: true,
      onSuccess: () => {
        toast.success("Negocio creado con éxito");
        router.push("/dashboard");
        router.refresh();
      },
    },
  });

  return (
    <Form {...form}>
      <form id="business-setup-form" className="space-y-8" onSubmit={execute}>
        {/* Nombre y Categoría */}
        <FieldGroup className="grid gap-6 md:grid-cols-2">
          {/* Categoría */}
          <Controller
            name="categories"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="vertical" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                  <FieldDescription>
                    Selecciona la categoría del negocio
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>

                <Select
                  value={field.value?.[0] || ""}
                  onValueChange={(val) => field.onChange([val])}
                  disabled={pending}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger id="category" className="min-w-[120px]">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="">Seleccionar categoría</SelectItem>
                    <SelectSeparator />
                    {categories.map(({ label, value }) => (
                      <SelectItem key={value} value={value.toLowerCase()}>
                        {label}
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
        </FieldGroup>

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
                placeholder="Ej: Vendemos pan artesanal todos los días..."
              />
              <FieldDescription>
                Describe brevemente tu negocio.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Datos de contacto */}
        <FieldGroup className="grid gap-6 md:grid-cols-2">
          {["address", "phone", "website"].map((name) => (
            <Controller
              key={name}
              name={name as "address" | "phone" | "website"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel className="capitalize">{name}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={!!fieldState.invalid}
                    placeholder={
                      {
                        address: "Calle 123, Ciudad",
                        phone: "+54 11 1234-5678",
                        email: "contacto@negocio.com",
                        website: "https://minegocio.com",
                      }[name]
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

        {/* Redes Sociales */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Redes Sociales</h3>
          <FieldGroup className="grid gap-6 md:grid-cols-3">
            {["whatsapp", "instagram", "facebook"].map((name) => (
              <Controller
                key={name}
                name={name as "whatsapp" | "instagram" | "facebook"}
                control={form.control}
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

        {/* Imágenes */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Imágenes</h3>
          <FieldGroup className="flex flex-col gap-6 md:flex-row">
            <Controller
              name="logo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel className="capitalize">Logo</FieldLabel>
                  <Uploader
                    folder="business/logos"
                    variant="avatar"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    value={field.value}
                    onChange={(files) => {
                      const file = Array.isArray(files) ? files[0] : files;
                      field.onChange(
                        file
                          ? {
                              url: file.url,
                              key: file.key,
                              name: file.name ?? "",
                              isMainImage: !!file.isMainImage,
                              size: file.size ?? 0,
                            }
                          : {
                              url: "",
                              key: "",
                              name: "",
                              isMainImage: false,
                              size: 0,
                            },
                      );
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="coverImage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel className="capitalize">
                    Imagen de portada
                  </FieldLabel>
                  <Uploader
                    folder={"business/covers"}
                    variant={"minimal"}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    value={field.value}
                    onChange={(files) => {
                      const file = Array.isArray(files) ? files[0] : files;
                      field.onChange(
                        file
                          ? {
                              url: file.url,
                              key: file.key,
                              name: file.name ?? "",
                              isMainImage: !!file.isMainImage,
                              size: file.size ?? 0,
                            }
                          : {
                              url: "",
                              key: "",
                              name: "",
                              isMainImage: false,
                              size: 0,
                            },
                      );
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Botones */}
        <Field orientation="horizontal" className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={pending}
          >
            Resetear
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Negocio
          </Button>
        </Field>
      </form>
    </Form>
  );
}
