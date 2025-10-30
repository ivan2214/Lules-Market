import { Check } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { PlanClient } from "./components/plan-client";
import { PlanCreateFormDialog } from "./components/plan-create-form-dialog";

async function getPlans() {
  "use cache";
  cacheLife("days");
  cacheTag("plans-page");
  const count = await prisma.plan.count();

  if (count === 0) {
    await prisma.plan.createMany({
      data: [
        {
          type: "FREE",
          name: "Plan Gratuito",
          description: "Perfecto para comenzar tu negocio online",
          price: 0,
          features: [
            "Hasta 10 productos",
            "3 imágenes por producto",
            "Catálogo básico",
            "Soporte por email",
          ],
          maxProducts: 10,
          maxImages: 3,
          isActive: true,
          createdAt: new Date("2023-12-01"),
        },
        {
          type: "BASIC",
          name: "Plan Básico",
          description: "Para negocios en crecimiento",
          price: 14999,
          features: [
            "Hasta 50 productos",
            "10 imágenes por producto",
            "Catálogo personalizado",
            "Estadísticas básicas",
            "Soporte prioritario",
          ],
          maxProducts: 50,
          maxImages: 10,
          isActive: true,
          createdAt: new Date("2023-12-01"),
        },
        {
          type: "PREMIUM",
          name: "Plan Premium",
          description: "Para negocios profesionales",
          price: 29999,
          features: [
            "Productos ilimitados",
            "Imágenes ilimitadas",
            "Catálogo premium",
            "Estadísticas avanzadas",
            "Soporte 24/7",
            "Dominio personalizado",
            "Sin comisiones",
          ],
          maxProducts: -1,
          maxImages: -1,
          isActive: true,
          createdAt: new Date("2023-12-01"),
        },
      ],
    });
  }

  const plans = await prisma.plan.findMany();

  return plans;
}

export default async function PlansPage() {
  const plans = await getPlans();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Planes
          </h1>
          <p className="text-muted-foreground">
            Administra los planes de suscripción disponibles
          </p>
        </div>
        <PlanCreateFormDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
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
                      : `$${(plan.price / 100).toFixed(2)}`}
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
