"use client";

import { useUploadFiles } from "@better-upload/client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { type Static, t } from "elysia";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { toast } from "sonner";
import pathsConfig from "@/config/paths.config";
import type { Category } from "@/db/types";
import { MultiStepFormProvider } from "@/hooks/use-multi-step-viewer";
import { api } from "@/lib/eden";
import { AuthError } from "@/shared/components/auth/auth-error";
import { AuthSuccess } from "@/shared/components/auth/auth-success";
import {
  FormFooter,
  FormHeader,
  MultiStepFormContent,
  NextButton,
  PreviousButton,
  ResetButton,
  StepFields,
  SubmitButton,
} from "@/shared/components/multi-step-viewer";
import { TagInput } from "@/shared/components/tag-input";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
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
import { Textarea } from "@/shared/components/ui/textarea";
import { UploadDropzone } from "@/shared/components/ui/upload-dropzone";
import { BusinessSetupSchema } from "@/shared/validators/business";
import { typeboxValidator } from "@/shared/validators/form";

const BusinessSetupSchemaForm = t.Omit(BusinessSetupSchema, ["userEmail"]);

const defaultValues: Static<typeof BusinessSetupSchemaForm> = {
  address: "",
  category: "",
  coverImage: {
    isMainImage: true,
    file: [],
    key: "",
  },
  description: "",
  logo: {
    isMainImage: true,
    file: [],
    key: "",
  },
  name: "",
  facebook: "",
  instagram: "",
  phone: "",
  tags: [],
  website: "",
  whatsapp: "",
};

export function SetupForm({
  categories,
  userEmail,
}: {
  categories: Category[];
  userEmail: string;
}) {
  const router = useRouter();

  const { mutate, isSuccess, error, isError, isPending } = useMutation({
    mutationKey: ["business", "setup"],
    mutationFn: async (values: Static<typeof BusinessSetupSchemaForm>) => {
      const { coverImage, logo, ...restData } = values;

      const { data, error } = await api.business.public.setup.post({
        userEmail,
        coverImage: {
          file: coverImage.file,
          key: coverImage.key,
          isMainImage: coverImage.isMainImage,
        },
        logo: {
          file: logo.file,
          key: logo.key,
          isMainImage: logo.isMainImage,
        },
        ...restData,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess() {
      toast.success("Cuenta creada exitosamente");
      router.push(pathsConfig.dashboard.root);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const uploaderCover = useUploadFiles({
    route: "businessCover",
    onUploadComplete: ({ files }) => {
      form.setFieldValue("coverImage.key", files[0].objectInfo.key);
    },
    onError(error) {
      toast.error(error.message);
    },
    api: "/api/upload",
  });
  const uploaderLogo = useUploadFiles({
    route: "businessLogo",
    onUploadComplete: ({ files }) => {
      form.setFieldValue("logo.key", files[0].objectInfo.key);
    },
    onError(error) {
      toast.error(error.message, {
        description: JSON.stringify(error),
      });
    },
    api: "/api/upload",
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: typeboxValidator(BusinessSetupSchemaForm),
    },
    onSubmit: async ({
      value,
    }: {
      value: Static<typeof BusinessSetupSchemaForm>;
    }) => {
      const {
        address,
        category,
        coverImage,
        description,
        logo,
        name: businessName,
        facebook,
        instagram,
        phone,
        tags,
        website,
        whatsapp,
      } = value || {};
      const { files: uploadedCoverFiles } = await uploaderCover.upload(
        coverImage.file,
      );
      const { files: uploadedLogoFiles } = await uploaderLogo.upload(logo.file);

      const coverImageWithKey = {
        ...coverImage,
        key: uploadedCoverFiles[0]?.objectInfo.key,
      };

      const logoWithKey = {
        ...logo,
        key: uploadedLogoFiles[0]?.objectInfo.key,
      };

      mutate({
        address,
        category,
        coverImage: coverImageWithKey,
        description,
        logo: logoWithKey,
        name: businessName,
        facebook,
        instagram,
        phone,
        tags,
        website,
        whatsapp,
      });
    },
    onSubmitInvalid(props) {
      const errorsArray = props.formApi.getAllErrors().form.errors;
      const errors = Object.values(errorsArray);
      toast.error("Por favor, corrige los errores", {
        description() {
          return (
            <pre className="max-h-[200px] overflow-y-scroll">
              <code className="bg-black p-2 text-white">
                {JSON.stringify(errors, null, 2)}
              </code>
            </pre>
          );
        },
      });
    },
  });

  const stepsFieldsIsBusiness: { fields: string[]; component: JSX.Element }[] =
    [
      {
        fields: ["name", "description", "category"],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Nombre de su negocio *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="San Expedito"
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
                    <FieldLabel htmlFor={field.name}>Descripcion *</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Venta de comestibles y productos varios"
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
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Categoría *</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una categoría " />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
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
          </FieldGroup>
        ),
      },
      {
        fields: ["address", "phone", "tags"],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="address">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Dirección *</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="9 de Julio 203"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    <FieldLabel htmlFor={field.name}>Telefono *</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="3812567687"
                      type="tel"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="tags">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1 [&_p]:pb-2">
                    <FieldLabel>Etiquetas *</FieldLabel>
                    <TagInput
                      tags={
                        field.state.value?.map((tag) => ({
                          id: tag,
                          text: tag,
                        })) ?? []
                      }
                      setTags={(newTags) => {
                        const value = field.state.value || [];
                        const currentTags = value.map((tag) => ({
                          id: tag,
                          text: tag,
                        }));
                        const nextTags =
                          typeof newTags === "function"
                            ? newTags(currentTags)
                            : newTags;
                        field.handleChange(nextTags.map((t) => t.text));
                      }}
                      placeholder="comercio, comidas, comestible"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        ),
      },
      {
        fields: ["whatsapp", "facebook", "instagram", "website"],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="whatsapp">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="col-span-full gap-1"
                  >
                    <FieldLabel htmlFor="input-64a">Whatsapp </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="381324657"
                    />
                    <FieldDescription>Su numero de Whatsapp</FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="facebook">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="col-span-full gap-1"
                  >
                    <FieldLabel htmlFor="input-b9e">Facebook </FieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type="text"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      aria-invalid={isInvalid}
                      placeholder="Enter your text"
                    />
                    <FieldDescription>URL de Facebook</FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="instagram">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="col-span-full gap-1"
                  >
                    <FieldLabel htmlFor="input-ead">Instagram </FieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      type="text"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      placeholder="Enter your text"
                    />
                    <FieldDescription>URL de Instagram</FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="website">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="col-span-full gap-1"
                  >
                    <FieldLabel htmlFor="website">Sitio Web </FieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      type="text"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      placeholder="Enter your text"
                    />
                    <FieldDescription>URL Sitio Web</FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        ),
      },
      {
        fields: ["logo", "coverImage"],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="logo">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Logo</FieldLabel>
                    {field.state.value && field.state.value.file.length > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        {field.state.value.file.map((file) => (
                          /* imagen y boton para sacar la imagen subida */
                          <div
                            key={file.name}
                            className="relative flex items-center gap-2"
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={100}
                              height={100}
                            />
                            <Button
                              variant="destructive"
                              type="button"
                              className="-top-5 -right-5 absolute h-6 w-6"
                              onClick={() => {
                                field.handleChange({
                                  file:
                                    field.state.value?.file?.filter(
                                      (f) => f !== file,
                                    ) || [],
                                  isMainImage: true,
                                  key: "",
                                });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <UploadDropzone
                        isAvatarVariant={true}
                        id={field.name}
                        control={uploaderLogo.control}
                        description={{
                          maxFiles: 5,
                          maxFileSize: "5MB",
                        }}
                        uploadOverride={(files) => {
                          field.handleChange({
                            file: Array.from(files),
                            isMainImage: true,
                            key: "",
                          });
                        }}
                      />
                    )}
                    {isInvalid && (
                      <FieldError
                        errors={
                          uploaderLogo.error
                            ? [{ message: uploaderLogo.error.message }]
                            : field.state.meta.errors
                        }
                      />
                    )}
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
                      Imagen de portada
                    </FieldLabel>
                    {field.state.value && field.state.value.file.length > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        {field.state.value.file.map((file) => (
                          /* imagen y boton para sacar la imagen subida */
                          <div
                            key={file.name}
                            className="relative flex items-center gap-2"
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={100}
                              height={100}
                              className="aspect-auto h-full w-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              type="button"
                              className="-top-5 -right-5 absolute h-6 w-6"
                              onClick={() => {
                                field.handleChange({
                                  file:
                                    field.state.value?.file?.filter(
                                      (f) => f !== file,
                                    ) || [],
                                  isMainImage: true,
                                  key: "",
                                });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <UploadDropzone
                        id={field.name}
                        control={uploaderCover.control}
                        description={{
                          maxFiles: 5,
                          maxFileSize: "5MB",
                        }}
                        uploadOverride={(files) => {
                          field.handleChange({
                            file: Array.from(files),
                            isMainImage: true,
                            key: "",
                          });
                        }}
                      />
                    )}
                    {isInvalid && (
                      <FieldError
                        errors={
                          uploaderCover.error
                            ? [{ message: uploaderCover.error.message }]
                            : field.state.meta.errors
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        ),
      },
    ].filter(Boolean) as { fields: string[]; component: JSX.Element }[];
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <MultiStepFormProvider
          /* stepsFields={
            isBusiness
              ? [...stepsFieldsNoBusiness, ...stepsFieldsIsBusiness]
              : stepsFieldsNoBusiness
          } */
          stepsFields={stepsFieldsIsBusiness}
        >
          <MultiStepFormContent>
            <FormHeader />
            <StepFields />
            <FormFooter>
              <PreviousButton>
                <ChevronLeft />
                Previous
              </PreviousButton>
              <NextButton>
                Next <ChevronRight />
              </NextButton>
              <ResetButton
                onClick={() => {
                  form.reset();
                  uploaderCover.reset();
                  uploaderLogo.reset();
                }}
              />
              <SubmitButton
                type="submit"
                disabled={
                  isPending ||
                  form.state.isSubmitting ||
                  uploaderCover.isPending ||
                  uploaderLogo.isPending
                }
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Registrando..." : "Registrarse"}
              </SubmitButton>
            </FormFooter>
          </MultiStepFormContent>
        </MultiStepFormProvider>
      </form>
      {isError && <AuthError error={error.message} />}
      {isSuccess && <AuthSuccess message={"Registro exitoso"} />}
      {/*   {!isBusiness && (
        <>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              O continuar con
            </span>
          </div>
          <OAuthProviders isBusiness={isBusiness} />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Con correo y contraseña
            </span>
          </div>
        </>
      )} */}
    </>
  );
}
