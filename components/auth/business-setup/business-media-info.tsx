"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Uploader } from "@/components/uploader/uploader";

export function BusinessMediaInfo() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Imágenes</h3>
      <FieldGroup className="flex flex-col gap-6 md:flex-row">
        <Controller
          name="logo"
          control={control}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="coverImage"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.invalid}>
              <FieldLabel className="capitalize">Imagen de portada</FieldLabel>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
