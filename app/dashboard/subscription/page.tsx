import { getPlans } from "@/app/actions/plan-actions";
import { getSubscriptionHistory } from "@/app/actions/subscription-actions";
import { getCurrentBusiness } from "@/app/data/business/require-busines";
import { PlanCard } from "@/components/dashboard/plan-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SubscriptionPage() {
  const { currentBusiness } = await getCurrentBusiness();

  const payments = await getSubscriptionHistory();

  const plans = await getPlans();

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
                {currentBusiness.currentPlan?.productsUsed ?? 0} /{" "}
                {currentBusiness.currentPlan?.planType === "PREMIUM"
                  ? "∞"
                  : currentBusiness.currentPlan?.plan?.maxProducts || 0}
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
