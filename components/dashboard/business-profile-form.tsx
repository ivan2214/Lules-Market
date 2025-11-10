"use client";

import { Controller } from "react-hook-form";
import { updateBusinessAction } from "@/app/actions/business-actions";
import {
  type BusinessDTO,
  type BusinessUpdateInput,
  BusinessUpdateInputSchema,
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
import { useAction } from "@/hooks/use-action";
import { Uploader } from "../uploader/uploader";

interface BusinessProfileFormProps {
  business: BusinessDTO & {
    coverImage: ImageCreateInput;
    logo: ImageCreateInput;
  };
  categories: { label: string; value: string }[];
}

export function BusinessProfileForm({
  business,
  categories,
}: BusinessProfileFormProps) {
  const defaultValues: BusinessUpdateInput = business.id
    ? {
        name: business.name ?? "",
        description: business.description ?? "",
        address: business.address ?? "",
        phone: business.phone ?? "",
        email: business.email ?? "",
        website: business.website ?? "",

        whatsapp: business.whatsapp ?? "",
        facebook: business.facebook ?? "",
        instagram: business.instagram ?? "",

        categories:
          business.categories?.map((category) => category.value) ?? [],
        coverImage: business.coverImage ?? {
          url: "",
          key: "",
          name: "",
          isMainImage: false,
          size: 0,
        },
        logo: business.logo ?? {
          url: "",
          key: "",
          name: "",
          isMainImage: false,
          size: 0,
        },
      }
    : {
        name: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        website: "",

        whatsapp: "",
        facebook: "",
        instagram: "",

        categories: [],
        coverImage: {
          url: "",
          key: "",
          name: "",
          isMainImage: false,
          size: 0,
        },
        logo: {
          url: "",
          key: "",
          name: "",
          isMainImage: false,
          size: 0,
        },
      };

  const { form, execute, pending } = useAction({
    action: updateBusinessAction,
    formSchema: BusinessUpdateInputSchema,
    defaultValues,
    options: { showToasts: true },
  });

  console.log(defaultValues);

  return (
    <form id="business-profile-form" className="space-y-6" onSubmit={execute}>
      <FieldGroup className="grid gap-6 md:grid-cols-2">
        {/* Nombre */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                <FieldDescription>
                  Ingresa el nombre del negocio
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                id={field.name}
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Nombre del negocio"
                aria-invalid={fieldState.invalid}
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Descripción */}
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
            </FieldContent>
            <Textarea
              id={field.name}
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="Describe tu negocio..."
              className="min-h-[120px] resize-none"
              aria-invalid={fieldState.invalid}
              disabled={pending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        {/* Dirección */}
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
                <FieldDescription>
                  Ingresa la dirección del negocio
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                id={field.name}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Calle 123, Ciudad"
                aria-invalid={fieldState.invalid}
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Teléfono */}
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
                <FieldDescription>
                  Ingresa el número de teléfono del negocio
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                id={field.name}
                type="tel"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="+54 11 1234-5678"
                aria-invalid={fieldState.invalid}
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <FieldDescription>
                  Ingresa el email del negocio
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                id={field.name}
                type="email"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="contacto@negocio.com"
                aria-invalid={fieldState.invalid}
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Website */}
        <Controller
          name="website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Sitio Web</FieldLabel>
                <FieldDescription>
                  Ingresa el sitio web del negocio
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                id={field.name}
                type="url"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="https://minegocio.com"
                aria-invalid={fieldState.invalid}
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {name === "whatsapp"
                        ? "WhatsApp"
                        : name[0].toUpperCase() + name.slice(1)}
                    </FieldLabel>
                    <FieldDescription>
                      {name === "whatsapp"
                        ? "Ingresa el número de WhatsApp del negocio"
                        : `Ingresa el nombre de usuario de ${name}`}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Input
                    id={field.name}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={
                      name === "whatsapp" ? "+54 11 1234-5678" : "@minegocio"
                    }
                    aria-invalid={fieldState.invalid}
                    disabled={pending}
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
        <FieldGroup className="flex items-center justify-evenly">
          <Controller
            name="logo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Logo</FieldLabel>
                <Uploader
                  folder="business/logos"
                  onChange={(
                    files: ImageCreateInput | ImageCreateInput[] | null,
                  ) => {
                    const isArray = Array.isArray(files);
                    const file = isArray ? files[0] : files;
                    field.onChange(
                      file
                        ? {
                            url: file.url,
                            key: file.key,
                            isMainImage: file.isMainImage ?? false,
                            name: file.name ?? null,
                            size: file.size ?? null,
                          }
                        : null,
                    );
                  }}
                  variant="avatar"
                  placeholder="Subí tu logo"
                  maxSize={1024 * 1024 * 5}
                  maxFiles={1}
                  value={field.value}
                  disabled={fieldState.invalid || pending}
                  aria-invalid={fieldState.invalid}
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
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Imagen de Portada</FieldLabel>
                <Uploader
                  folder="business/covers"
                  onChange={(
                    files: ImageCreateInput | ImageCreateInput[] | null,
                  ) => {
                    const isArray = Array.isArray(files);
                    const file = isArray ? files[0] : files;
                    field.onChange(
                      file
                        ? {
                            url: file.url,
                            key: file.key,
                            isMainImage: file.isMainImage ?? false,
                            name: file.name ?? null,
                            size: file.size ?? null,
                          }
                        : null,
                    );
                  }}
                  placeholder="Subí tu imagen de portada"
                  maxSize={1024 * 1024 * 5}
                  maxFiles={1}
                  value={field.value}
                  disabled={fieldState.invalid || pending}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
