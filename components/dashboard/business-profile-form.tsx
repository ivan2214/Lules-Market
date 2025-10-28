"use client";

import { useForm } from "@tanstack/react-form";
import {
  BusinessCreateInputSchema,
  type BusinessDTO,
} from "@/app/data/business/business.dto";
import type { ImageCreateInput } from "@/app/data/image/image.dto";
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
import { Uploader } from "../uploader/uploader";

const CATEGORIES = [
  "Restaurante",
  "Cafetería",
  "Tienda de Ropa",
  "Supermercado",
  "Farmacia",
  "Peluquería",
  "Gimnasio",
  "Librería",
  "Ferretería",
  "Panadería",
  "Otro",
];

interface BusinessProfileFormProps {
  business: BusinessDTO;
}

export function BusinessProfileForm({ business }: BusinessProfileFormProps) {
  const form = useForm({
    defaultValues: business.id
      ? {
          name: business.name ?? "",
          description: business.description ?? null,
          address: business.address ?? null,
          phone: business.phone ?? null,
          email: business.email ?? null,
          website: business.website ?? null,
          hours: business.hours ?? null,
          whatsapp: business.whatsapp ?? null,
          facebook: business.facebook ?? null,
          instagram: business.instagram ?? null,
          twitter: business.twitter ?? null,
          category: business.category ?? null,
          coverImage: business.coverImage ?? null,
          logo: business.logo,
        }
      : {
          name: "",
          description: null,
          address: null,
          phone: null,
          email: null,
          website: null,
          hours: null,
          whatsapp: null,
          facebook: null,
          instagram: null,
          twitter: null,
          category: null,
          coverImage: null,
          logo: null,
        },
    validators: {
      onSubmit: async ({ value }) => {
        const parsed = BusinessCreateInputSchema.safeParse(value);
        if (!parsed.success) {
          return parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }));
        }
      },
      onChange: async ({ value }) => {
        const parsed = BusinessCreateInputSchema.safeParse(value);
        if (!parsed.success) {
          return parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }));
        }
      },
      onBlur: async ({ value }) => {
        const parsed = BusinessCreateInputSchema.safeParse(value);
        if (!parsed.success) {
          return parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }));
        }
      },
    },
  });

  return (
    <form
      id="business-profile-form"
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                  <FieldDescription>
                    Ingresa el nombre del producto
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nombre del producto"
                  aria-invalid={isInvalid}
                  /* disabled={pending} */
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="category">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="vertical" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                  <FieldDescription>
                    Selecciona la categoría del producto
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value || undefined}
                  onValueChange={field.handleChange}
                  /* disabled={pending} */
                  aria-invalid={isInvalid}
                >
                  <SelectTrigger
                    id="business-profile-form"
                    aria-invalid={isInvalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="auto">Seleccionar categoría</SelectItem>
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
      </FieldGroup>
      <form.Field name="description">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
              </FieldContent>
              <Textarea
                id="business-profile-form"
                name={field.name}
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Describe tu negocio..."
                className="min-h-[120px] resize-none"
                /* disabled={pending} */
              />

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
                  <FieldDescription>
                    Ingresa la dirección del negocio
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  defaultValue={business.address || ""}
                  placeholder="Calle 123, Ciudad"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="phone">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
                  <FieldDescription>
                    Ingresa el número de teléfono del negocio
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  defaultValue={business.phone || ""}
                  placeholder="+54 11 1234-5678"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <FieldDescription>
                    Ingresa el email del negocio
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  defaultValue={business.email || ""}
                  placeholder="contacto@negocio.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="website">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Sitio Web</FieldLabel>
                  <FieldDescription>
                    Ingresa el sitio web del negocio
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  defaultValue={business.website || ""}
                  placeholder="https://minegocio.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <form.Field name="hours">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    Horarios de Atención
                  </FieldLabel>
                  <FieldDescription>
                    Ingresa los horarios de atención del negocio
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Textarea
                  id={field.name}
                  name={field.name}
                  defaultValue={business.hours || ""}
                  placeholder="Lunes a Viernes: 9:00 - 18:00 Sábados: 10:00 - 14:00"
                  rows={3}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Redes Sociales</h3>
        <FieldGroup className="grid gap-6 md:grid-cols-3">
          <form.Field name="whatsapp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>WhatsApp</FieldLabel>
                    <FieldDescription>
                      Ingresa el número de WhatsApp del negocio
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    defaultValue={business.whatsapp || ""}
                    placeholder="+54 11 1234-5678"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="instagram">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Instagram</FieldLabel>
                    <FieldDescription>
                      Ingresa el nombre de usuario de Instagram
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Input
                    id={field.name}
                    name={field.name}
                    defaultValue={business.instagram || ""}
                    placeholder="@minegocio"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="facebook">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Facebook</FieldLabel>
                    <FieldDescription>
                      Ingresa el nombre de usuario de Facebook
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Input
                    id={field.name}
                    name={field.name}
                    defaultValue={business.facebook || ""}
                    placeholder="@minegocio"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Imágenes</h3>
        <FieldGroup className="flex items-center justify-evenly">
          <form.Field name="logo">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Imagenes</FieldLabel>
                  <Uploader
                    folder="business/logos"
                    onChange={(
                      files: (ImageCreateInput | ImageCreateInput[]) | null,
                    ) => {
                      const isArray = Array.isArray(files);
                      if (isArray) {
                        field.handleChange({
                          url: files[0].url,
                          key: files[0].key,
                          isMainImage: files[0].isMainImage,
                          name: files[0].name ?? null,
                          size: files[0].size ?? null,
                        });
                      } else {
                        field.handleChange({
                          url: files?.url ?? "",
                          key: files?.key ?? "",
                          isMainImage: files?.isMainImage ?? false,
                          name: files?.name ?? null,
                          size: files?.size ?? null,
                        });
                      }
                    }}
                    variant="avatar"
                    placeholder="Subí tu logo"
                    maxSize={1024 * 1024 * 5}
                    maxFiles={1}
                    value={field.state.value}
                    disabled={isInvalid}
                    aria-invalid={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="coverImage">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Imagen de Portada
                  </FieldLabel>
                  <Uploader
                    folder="business/covers"
                    onChange={(
                      files: (ImageCreateInput | ImageCreateInput[]) | null,
                    ) => {
                      const isArray = Array.isArray(files);
                      if (isArray) {
                        field.handleChange({
                          url: files[0].url,
                          key: files[0].key,
                          isMainImage: files[0].isMainImage,
                          name: files[0].name ?? null,
                          size: files[0].size ?? null,
                        });
                      } else {
                        field.handleChange({
                          url: files?.url ?? "",
                          key: files?.key ?? "",
                          isMainImage: files?.isMainImage ?? false,
                          name: files?.name ?? null,
                          size: files?.size ?? null,
                        });
                      }
                    }}
                    variant="compact"
                    placeholder="Subí tu imagen de portada"
                    maxSize={1024 * 1024 * 5}
                    maxFiles={1}
                    value={field.state.value}
                    disabled={isInvalid}
                    aria-invalid={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">
          {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
