"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { type JSX, useState } from "react";
import type z from "zod";
import type { Category, ImageInsert } from "@/db/types";
import { MultiStepFormProvider } from "@/hooks/use-multi-step-viewer";
import { orpc } from "@/orpc";
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
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { type SignUpSchema, signUpSchema } from "@/shared/validators/auth";
import type { BusinessSetupSchema } from "@/shared/validators/business";
import {
  FormFooter,
  FormHeader,
  MultiStepFormContent,
  NextButton,
  PreviousButton,
  StepFields,
  SubmitButton,
} from "../multi-step-viewer";
import { TagInput } from "../tag-input";
import { Uploader } from "../uploader/uploader";
import { AuthError } from "./auth-error";
import { AuthSuccess } from "./auth-success";
import { OAuthProviders } from "./oauth-providers";

const defaultValues: SignUpSchema = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isBusiness: false,
  businessData: {
    address: "",
    category: "",
    coverImage: {
      isMainImage: true,
      key: "",
      name: "",
      size: 0,
      url: "",
    },
    description: "",
    logo: {
      isMainImage: true,
      key: "",
      name: "",
      size: 0,
      url: "",
    },
    name: "",
    facebook: "",
    instagram: "",
    phone: "",
    tags: [],
    website: "",
    whatsapp: "",
    userEmail: "",
  },
};

export function PasswordSignUpForm({ categories }: { categories: Category[] }) {
  const [isBusiness, setIsBusiness] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isSuccess, error, isError, isPending } = useMutation(
    orpc.auth.signup.mutationOptions({
      onSuccess(data, variables, onMutateResult, context) {
        console.log(data, variables, onMutateResult, context);
      },
    }),
  );

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: signUpSchema,
      onChange: signUpSchema,
      onBlur: signUpSchema,
    },
    onSubmit: (data) => {
      const { businessData } = data.value;
      const {
        address,
        category,
        coverImage,
        description,
        logo,
        name,
        facebook,
        instagram,
        phone,
        tags,
        website,
        whatsapp,
      } = (isBusiness ? businessData : {}) as z.infer<
        typeof BusinessSetupSchema
      >;

      mutate({
        name: data.value.name,
        email: data.value.email,
        password: data.value.password,

        isBusiness,
        businessData: isBusiness
          ? {
              address,
              category,
              coverImage,
              description,
              logo,
              name,
              facebook,
              instagram,
              phone,
              tags,
              website,
              whatsapp,
              userEmail: data.value.email,
            }
          : undefined,
      });
    },
  });

  const stepsFields: { fields: string[]; component: JSX.Element }[] = [
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
    isBusiness && {
      fields: ["name", "description", "category"],
      component: (
        <FieldGroup className="col-span-6">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Nombre *</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="San Expedito"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <FieldDescription>
                    A multi-line text input field
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      ),
    },
    isBusiness && {
      fields: ["address", "phone", "tags"],
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      ),
    },
    isBusiness && {
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
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="businessData.facebook">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="businessData.instagram">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="businessData.website">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      ),
    },
    isBusiness && {
      fields: ["logo", "coverImage"],
      component: (
        <FieldGroup className="col-span-6">
          <form.Field name="businessData.logo">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={!!isInvalid}>
                  <FieldLabel className="capitalize">Logo</FieldLabel>
                  <Uploader
                    folder="business/logos"
                    variant="avatar"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    value={
                      (field.state.value as unknown as ImageInsert) ?? {
                        url: "",
                        key: "",
                        name: "",
                        isMainImage: true,
                        size: 0,
                      }
                    }
                    onChange={(files) => {
                      const file = Array.isArray(files) ? files[0] : files;
                      field.handleChange(
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="businessData.coverImage">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={!!isInvalid}>
                  <FieldLabel className="capitalize">
                    Imagen de portada
                  </FieldLabel>
                  <Uploader
                    folder={"business/covers"}
                    variant={"minimal"}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    value={
                      (field.state.value as unknown as ImageInsert) ?? {
                        url: "",
                        key: "",
                        name: "",
                        isMainImage: true,
                        size: 0,
                      }
                    }
                    onChange={(files) => {
                      const file = Array.isArray(files) ? files[0] : files;
                      field.handleChange(
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
      {isError && <AuthError error={error.message} />}
      {isSuccess && <AuthSuccess message={"Registro exitoso"} />}
      <div className="flex items-center gap-2">
        <p>¿Es un negocio?</p>
        <Switch
          checked={isBusiness}
          onCheckedChange={(checked) => {
            setIsBusiness(checked || false);
          }}
        />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <MultiStepFormProvider
          stepsFields={stepsFields}
          onStepValidation={() => {
            const isValid = form.state.isValid;
            console.log(isValid);

            return isValid;
          }}
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
              <SubmitButton type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Registrando..." : "Registrarse"}
              </SubmitButton>
            </FormFooter>
          </MultiStepFormContent>
        </MultiStepFormProvider>
      </form>

      {!isBusiness && (
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
      )}
    </>
  );
}
