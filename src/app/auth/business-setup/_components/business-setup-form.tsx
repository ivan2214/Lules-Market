"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { orpc } from "@/orpc";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { BusinessSetupSchema } from "@/shared/validators/business";
import { BusinessBasicInfo } from "./business-basic-info";
import { BusinessContactInfo } from "./business-contact-info";
import { BusinessMediaInfo } from "./business-media-info";
import { BusinessSocialInfo } from "./business-social-info";

type BusinessSetupInput = z.infer<typeof BusinessSetupSchema>;

export function BusinessSetupForm({
  categories,
}: {
  categories: { label: string; value: string }[];
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
  };

  const [pending, startTransition] = useTransition();

  const form = useForm<BusinessSetupInput>({
    defaultValues,
    resolver: zodResolver(BusinessSetupSchema),
  });

  const { mutate } = useMutation(
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

  const onSubmit = async (data: BusinessSetupInput) => {
    startTransition(async () => {
      mutate(data);
    });
  };

  return (
    <Form {...form}>
      <form
        id="business-setup-form"
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Nombre y Categoría */}
        <FieldGroup className="grid gap-6 md:grid-cols-2">
          <BusinessBasicInfo categories={categories} pending={pending} />
        </FieldGroup>

        {/* Datos de contacto */}
        <BusinessContactInfo />

        {/* Redes Sociales */}
        <BusinessSocialInfo />

        {/* Imágenes */}
        <BusinessMediaInfo />

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
