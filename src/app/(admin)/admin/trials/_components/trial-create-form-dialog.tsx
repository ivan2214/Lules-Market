"use client";

import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Form } from "@wandry/inertia-form";
import { addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { orpc, orpcTanstack } from "@/lib/orpc";
import AsyncAutocompleteField from "@/shared/components/async-autocomplete-field";
import ChoiseboxField from "@/shared/components/choisebox-field";
import DatepickerField from "@/shared/components/datepicker-field";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Field, FieldGroup } from "@/shared/components/ui/field";

const CreateTrialFormSchema = z.object({
  businessId: z.string().min(1, "Selecciona un negocio"),
  plan: z.enum(["BASIC", "PREMIUM"]),
  endDate: z
    .date()
    .min(new Date(), "La fecha debe ser mayor a la fecha actual"),
});

export const TrialCreateFormDialog = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: plans } = useSuspenseQuery(
    orpcTanstack.admin.getAllPlans.queryOptions(),
  );

  const form = useForm({
    defaultValues: {
      businessId: "",
      plan: "BASIC",
      endDate: addMonths(new Date(), 1),
    },
    validators: {
      onSubmit: CreateTrialFormSchema,
      onChange: CreateTrialFormSchema,
      onBlur: CreateTrialFormSchema,
    },
  });

  const handleCreate = () => {
    const isFormValid = form.state.isFormValid;

    if (!isFormValid) return;
    setIsCreateDialogOpen(false);
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Trial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-7rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Prueba Gratuita</DialogTitle>
          <DialogDescription>
            Asigna una prueba gratuita a un negocio
          </DialogDescription>
        </DialogHeader>
        <Form action="#">
          <FieldGroup>
            <form.Field name="businessId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <AsyncAutocompleteField
                      label="Selecciona un Negocio"
                      placeholder="Busca un negocio"
                      description="Empieza a escribir para buscar un negocio"
                      name="businessId"
                      emptyPlaceholder="No hay negocios"
                      errorName="businessId"
                      loadingPlaceholder="Cargando negocios..."
                      initPlaceholder="Selecciona un negocio"
                      loadOptions={async (inputSearch) => {
                        const { businesses } =
                          await orpc.business.listAllBusinesses({
                            search: inputSearch,
                          });
                        return businesses.map((business) => ({
                          label: business.name,
                          value: business.id,
                        }));
                      }}
                    />
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          <form.Field name="plan">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <ChoiseboxField
                    name="plan"
                    label="Plan"
                    description="Selecciona el plan"
                    options={plans.map((plan) => ({
                      label: plan.name,
                      description: plan.description,
                      value: plan.type,
                    }))}
                    defaultValue="BASIC"
                  />
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="plan">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <DatepickerField
                    name="endDate"
                    errorName="endDate"
                    label="Fecha de Expiración"
                    placeholder="Selecciona la fecha de expiración"
                    description="Selecciona la fecha de expiración del trial"
                    animate
                    mode="single"
                    month={new Date()}
                    defaultMonth={form.state.values.endDate}
                    startMonth={form.state.values.endDate}
                    timeZone="America/Argentina/Buenos_Aires"
                    today={new Date()}
                    locale={es}
                    lang="esAR"
                  />
                </Field>
              );
            }}
          </form.Field>
        </Form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" onClick={handleCreate}>
            Crear Trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
