"use client";

import { useUploadFiles } from "@better-upload/client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import { type JSX, useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import type { Category } from "@/db/types";
import { MultiStepFormProvider } from "@/hooks/use-multi-step-viewer";
import { api } from "@/lib/eden";
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
import { type SignUpSchema, signUpSchema } from "@/shared/validators/auth";
import type { BusinessSetupSchema } from "@/shared/validators/business";
import {
  FormFooter,
  FormHeader,
  MultiStepFormContent,
  NextButton,
  PreviousButton,
  ResetButton,
  StepFields,
  SubmitButton,
} from "../multi-step-viewer";
import { TagInput } from "../tag-input";
import { UploadDropzone } from "../ui/upload-dropzone";
import { AuthError } from "./auth-error";
import { AuthSuccess } from "./auth-success";

const defaultValues: SignUpSchema = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",

  businessData: {
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
  },
};

export function PasswordSignUpForm({ categories }: { categories: Category[] }) {
  /* const [isBusiness, setIsBusiness] = useState(false); */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isSuccess, error, isError, isPending } = useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: api.auth.signup.mutation,
    onSuccess() {
      toast.success("Cuenta creada exitosamente");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const uploaderCover = useUploadFiles({
    route: "businessCover",
    onUploadComplete: ({ files }) => {
      form.setFieldValue(
        "businessData.coverImage.key",
        files[0].objectInfo.key,
      );
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const uploaderLogo = useUploadFiles({
    route: "businessLogo",
    onUploadComplete: ({ files }) => {
      form.setFieldValue("businessData.logo.key", files[0].objectInfo.key);
    },
    onError(error) {
      toast.error(error.message, {
        description: JSON.stringify(error),
      });
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async (data) => {
      console.log(data);
      const { email, password, name } = data.value;
      const { businessData } = data.value;
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
      } = businessData as z.infer<typeof BusinessSetupSchema>;
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
        name: name,
        email: email,
        password: password,
        businessData: {
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
        },
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
        fields: [
          "businessData.name",
          "businessData.description",
          "businessData.category",
        ],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="businessData.name">
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

            <form.Field name="businessData.description">
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

            <form.Field name="businessData.category">
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
        fields: [
          "businessData.address",
          "businessData.phone",
          "businessData.tags",
        ],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="businessData.address">
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

            <form.Field name="businessData.phone">
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

            <form.Field name="businessData.tags">
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
        fields: [
          "businessData.whatsapp",
          "businessData.facebook",
          "businessData.instagram",
          "businessData.website",
        ],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="businessData.whatsapp">
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

            <form.Field name="businessData.facebook">
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

            <form.Field name="businessData.instagram">
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

            <form.Field name="businessData.website">
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
        fields: ["businessData.logo", "businessData.coverImage"],
        component: (
          <FieldGroup className="col-span-6">
            <form.Field name="businessData.logo">
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

            <form.Field name="businessData.coverImage">
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

  const stepsFieldsNoBusiness = [
    {
      fields: ["name", "email"],
      component: (
        <FieldGroup className="col-span-6 grid gap-2 md:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Juan Perez"
                    type="text"
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="example@gmail.com"
                    type="email"
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      ),
    },
    {
      fields: ["password", "confirmPassword"],
      component: (
        <FieldGroup className="col-span-6">
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="********"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="-translate-y-1/2 absolute top-1/2 right-3"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Confirmar Contraseña</FieldLabel>
                  <div className="relative">
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="********"
                      type={showConfirmPassword ? "text" : "password"}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="-translate-y-1/2 absolute top-1/2 right-3"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      ),
    },
  ];

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
          stepsFields={[...stepsFieldsNoBusiness, ...stepsFieldsIsBusiness]}
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
