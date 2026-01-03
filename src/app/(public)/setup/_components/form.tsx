"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTransition } from "react";
import { toast } from "sonner";
import type { Category } from "@/db/types";
import { MultiStepFormProvider } from "@/hooks/use-multi-step-viewer";
import { orpc } from "@/orpc";
import {
  FormFooter,
  FormHeader,
  MultiStepFormContent,
  NextButton,
  PreviousButton,
  StepFields,
  SubmitButton,
} from "@/shared/components/multi-step-viewer";
import { TagInput } from "@/shared/components/tag-input";
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
import { Uploader } from "@/shared/components/uploader/uploader";
import { BusinessSetupSchema } from "@/shared/validators/business";

export function BusinessSetupFormTwo({
  categories,
}: {
  categories: Category[];
}) {
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
    tags: [],
  };

  const [, startTransition] = useTransition();

  const { mutate, isPending, isSuccess } = useMutation(
    orpc.business.private.setup.mutationOptions({
      onSuccess: () => {
        toast.success("Negocio creado exitosamente", {
          description: "Tu negocio ha sido creado exitosamente.",
        });
      },
      onError: () => {
        toast.error("Error al crear el negocio", {
          description: "Hubo un error al crear el negocio.",
        });
      },
    }),
  );

  const form = useForm({
    defaultValues,
    validators: {
      onChange: BusinessSetupSchema.safeParse,
      onBlur: BusinessSetupSchema.safeParse,
      onSubmit: BusinessSetupSchema.safeParse,
    },
    onSubmit: (data) => {
      startTransition(() => {
        mutate(data.value);
      });
    },
  });

  const stepsFields = [
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
                  <FieldDescription>
                    A multi-line text input field
                  </FieldDescription>
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
                    setTags={(tags) => field.handleChange(tags)}
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
    {
      fields: ["whatsapp", "facebook", "instagram", "website"],
      component: (
        <FieldGroup className="col-span-6">
          <form.Field name="whatsapp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
                  <FieldLabel htmlFor="input-64a">Whatsapp </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                    aria-invalid={isInvalid}
                    placeholder="381324657"
                  />
                  <FieldDescription>Su numero de Whatsapp</FieldDescription>
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
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
                  <FieldLabel htmlFor="input-b9e">Facebook </FieldLabel>
                  <Input
                    {...field}
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

          <form.Field name="instagram">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
                  <FieldLabel htmlFor="input-ead">Instagram </FieldLabel>
                  <Input
                    {...field}
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

          <form.Field name="website">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full gap-1">
                  <FieldLabel htmlFor="website">Sitio Web </FieldLabel>
                  <Input
                    {...field}
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
    {
      fields: ["logo", "coverImage"],
      component: (
        <FieldGroup className="col-span-6">
          <form.Field name="logo">
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
                    value={field.state.value}
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
                  {isInvalid && (
                    <FieldError errors={[field.state.meta.errors]} />
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
                <Field data-invalid={!!isInvalid}>
                  <FieldLabel className="capitalize">
                    Imagen de portada
                  </FieldLabel>
                  <Uploader
                    folder={"business/covers"}
                    variant={"minimal"}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    value={field.state.value}
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
                  {isInvalid && (
                    <FieldError errors={[field.state.meta.errors]} />
                  )}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      ),
    },
  ];

  if (isSuccess) {
    return (
      <div className="w-full gap-2 rounded-md border p-2 sm:p-5 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full px-3 py-6"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mx-auto mb-4 flex w-fit justify-center rounded-full border p-2"
          >
            <Check className="size-8" />
          </motion.div>
          <h2 className="mb-2 text-pretty text-center font-bold text-2xl">
            Thank you
          </h2>
          <p className="text-pretty text-center text-lg text-muted-foreground">
            Form submitted successfully, we will get back to you soon
          </p>
        </motion.div>
      </div>
    );
  }
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-md border p-2 md:p-5"
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
                {isPending ? "Submitting..." : "Submit"}
              </SubmitButton>
            </FormFooter>
          </MultiStepFormContent>
        </MultiStepFormProvider>
      </form>
    </div>
  );
}
