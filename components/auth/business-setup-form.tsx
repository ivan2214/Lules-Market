"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { businessSetupAction } from "@/app/actions/business-actions";
import { BusinessSetupInputSchema } from "@/app/data/business/business.dto";
import { BusinessBasicInfo } from "@/components/auth/business-setup/business-basic-info";
import { BusinessContactInfo } from "@/components/auth/business-setup/business-contact-info";
import { BusinessMediaInfo } from "@/components/auth/business-setup/business-media-info";
import { BusinessSocialInfo } from "@/components/auth/business-setup/business-social-info";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { useAction } from "@/hooks/use-action";

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
    action: businessSetupAction,
    formSchema: BusinessSetupInputSchema,
    defaultValues,
    options: {
      showToasts: true,
      onSuccess: () => {
        toast.success("Negocio creado con éxito");
        router.push("/dashboard");
        router.refresh();
      },
      onError(state) {
        console.log("error:", state);
      },
    },
  });

  return (
    <Form {...form}>
      <form id="business-setup-form" className="space-y-8" onSubmit={execute}>
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
