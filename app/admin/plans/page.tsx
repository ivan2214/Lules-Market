import { Check, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/lib/orpc";
import { formatCurrency } from "@/utils/format";
import { PlanClient } from "./components/plan-client";
import { PlanForm } from "./components/plan-form";

export default async function PlansPage() {
  const plans = await orpc.admin.getAllPlans();
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Planes
          </h1>
          <p className="text-muted-foreground">
            Administra los planes de suscripción disponibles
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Plan</DialogTitle>
              <DialogDescription>
                Define los parámetros del nuevo plan de suscripción
              </DialogDescription>
            </DialogHeader>
            <PlanForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.type} className={!plan.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {plan.description}
                  </CardDescription>
                </div>
                <Badge variant={plan.isActive ? "outline" : "secondary"}>
                  {plan.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-bold text-3xl">
                    {plan.price === 0
                      ? "Gratis"
                      : formatCurrency(plan.price, "ARS")}
                  </div>
                  <div className="text-muted-foreground text-sm">por mes</div>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlanClient plans={plans} />
    </div>
  );
}
