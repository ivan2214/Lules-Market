import { getSubscriptionHistory } from "@/app/actions/subscription-actions";
import { getCurrentBusiness } from "@/app/data/business/require-busines";
import type { PlanType } from "@/app/generated/prisma/client";
import { PlanCard } from "@/components/dashboard/plan-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";
import type { IconComponentName } from "@/types";

const plans: {
  name: PlanType;
  title: string;
  price: number;
  icon: IconComponentName;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
}[] = [
  {
    name: "FREE",
    title: "Gratuito",
    price: SUBSCRIPTION_LIMITS.FREE.price,
    icon: "Sparkles",
    description: "Perfecto para comenzar",
    features: [
      `Hasta ${SUBSCRIPTION_LIMITS.FREE.maxProducts} productos`,
      "Perfil de negocio básico",
      "Contacto directo con clientes",
      "Búsqueda en catálogo",
    ],
    limitations: [
      "Sin estadísticas",
      "Sin productos destacados",
      "Prioridad baja en búsquedas",
    ],
  },
  {
    name: "BASIC",
    title: "Básico",
    price: SUBSCRIPTION_LIMITS.BASIC.price,
    icon: "Zap",
    description: "Para negocios en crecimiento",
    features: [
      `Hasta ${SUBSCRIPTION_LIMITS.BASIC.maxProducts} productos`,
      "Estadísticas simples",
      "Prioridad media en búsquedas",
      "Soporte por email",
    ],
    popular: true,
  },
  {
    name: "PREMIUM",
    title: "Premium",
    price: SUBSCRIPTION_LIMITS.PREMIUM.price,
    icon: "Crown",
    description: "Para negocios establecidos",
    features: [
      "Productos ilimitados",
      "Destacar productos",
      "Estadísticas avanzadas",
      "Máxima prioridad en búsquedas",
      "Soporte prioritario",
    ],
  },
];

export default async function SubscriptionPage() {
  const { currentBusiness } = await getCurrentBusiness();

  const payments = await getSubscriptionHistory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Suscripción</h1>
        <p className="text-muted-foreground">Gestiona tu plan y facturación</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Plan Actual</CardTitle>
          <CardDescription>Tu suscripción activa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-2xl">
                {currentBusiness.currentPlan?.planType}
              </p>
              <p className="text-muted-foreground text-sm">
                Estado:{" "}
                <Badge
                  variant={
                    currentBusiness.currentPlan?.planStatus === "ACTIVE"
                      ? "default"
                      : "secondary"
                  }
                >
                  {currentBusiness.currentPlan?.planStatus === "ACTIVE"
                    ? "Activo"
                    : currentBusiness.currentPlan?.planStatus}
                </Badge>
              </p>
              {currentBusiness.currentPlan?.expiresAt && (
                <p className="mt-1 text-muted-foreground text-sm">
                  Vence:{" "}
                  {new Date(
                    currentBusiness.currentPlan.expiresAt,
                  ).toLocaleDateString("es-AR")}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Productos</p>
              <p className="font-bold text-2xl">
                {currentBusiness.products?.length ?? 0} /{" "}
                {SUBSCRIPTION_LIMITS[
                  currentBusiness.currentPlan?.planType || "FREE"
                ].maxProducts === -1
                  ? "∞"
                  : SUBSCRIPTION_LIMITS[
                      currentBusiness.currentPlan?.planType || "FREE"
                    ].maxProducts}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-6 font-bold text-2xl">Planes Disponibles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              currentPlan={currentBusiness.currentPlan?.planType}
              planStatus={currentBusiness.currentPlan?.planStatus}
            />
          ))}
        </div>
      </div>

      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Tus últimas transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">Plan {payment.plan}</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(payment.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        payment.status === "approved" ? "default" : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
