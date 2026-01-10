"use client";

import { Check, Crown, InfinityIcon, Sparkles, Zap } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { Plan, PlanStatus, PlanType } from "@/db/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface PlanCardProps {
  plan: Plan;
  currentPlan?: PlanType | null;
  planStatus?: PlanStatus | null;
}

export function PlanCard({ plan, currentPlan }: PlanCardProps) {
  const router = useRouter();

  const isCurrent = currentPlan === plan.name;
  const isDowngrade =
    getPlanLevel(plan.name as PlanType) < getPlanLevel(currentPlan);

  function handleUpgrade() {
    if (isCurrent) return;

    if (plan.price > 0) {
      router.push(`/dashboard/subscription/checkout?plan=${plan.type}`);
    } else {
      // For free plan, handle directly
      router.push(
        `/dashboard/subscription/downgrade?plan=${plan.type}` as Route,
      );
    }
  }

  return (
    <Card
      className={cn(
        plan.type === "BASIC" && "relative border-primary shadow-lg",
        currentPlan === plan.type && "cursor-not-allowed opacity-50",
      )}
    >
      {plan.type === "BASIC" && (
        <Badge className="-top-3 -translate-x-1/2 absolute left-1/2">
          Más Popular
        </Badge>
      )}
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          {getIcon(plan.type)}
          {isCurrent && <Badge>Actual</Badge>}
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="font-bold text-4xl">
            {formatCurrency(plan.price, "ARS")}
          </span>
          {plan.price > 0 && (
            <span className="text-muted-foreground">/mes</span>
          )}
        </div>

        <div className="space-y-2">
          {(plan.maxProducts || plan.type === "PREMIUM") && (
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span
                className={cn(
                  "text-sm",
                  plan.type === "PREMIUM" && "flex items-center gap-2",
                )}
              >
                {plan.type === "PREMIUM"
                  ? "Productos Ilimitados"
                  : `${plan.maxProducts} Productos`}
                {plan.type === "PREMIUM" && (
                  <InfinityIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                )}
              </span>
            </div>
          )}
          {(plan.maxImagesPerProduct || plan.type === "PREMIUM") && (
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span
                className={cn(
                  "text-sm",
                  plan.type === "PREMIUM" && "flex items-center gap-2",
                )}
              >
                {plan.type === "PREMIUM"
                  ? "Imágenes Ilimitadas"
                  : `${plan.maxImagesPerProduct} imágenes por producto`}
                {plan.type === "PREMIUM" && (
                  <InfinityIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                )}
              </span>
            </div>
          )}
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpgrade}
          disabled={isCurrent || isDowngrade || currentPlan === plan.type}
          className="w-full"
          variant={plan.type === "BASIC" ? "default" : "outline"}
        >
          {isCurrent
            ? "Plan Actual"
            : isDowngrade
              ? "No disponible"
              : plan.price === 0
                ? "Cambiar a Gratuito"
                : "Mejorar Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function getPlanLevel(plan?: PlanType | null): number {
  const levels = { FREE: 0, BASIC: 1, PREMIUM: 2 };
  return levels[plan || "FREE"];
}

function getIcon(plan: PlanType) {
  switch (plan) {
    case "FREE":
      return <Sparkles className="h-8 w-8 text-primary" />;
    case "BASIC":
      return <Zap className="h-8 w-8 text-primary" />;
    case "PREMIUM":
      return <Crown className="h-8 w-8 text-primary" />;
  }
}
