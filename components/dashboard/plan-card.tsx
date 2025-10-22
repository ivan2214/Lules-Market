"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IconComponentName } from "@/types";
import { DynamicIcon } from "../dynamic-icon";

interface PlanCardProps {
  plan: {
    name: string;
    title: string;
    price: number;
    icon: IconComponentName;
    description: string;
    features: string[];
    limitations?: string[];
    popular?: boolean;
  };
  currentPlan?: SubscriptionPlan | null;
  planStatus?: SubscriptionStatus | null;
}

export function PlanCard({ plan, currentPlan }: PlanCardProps) {
  const router = useRouter();

  const isCurrent = currentPlan === plan.name;
  const isDowngrade =
    getPlanLevel(plan.name as SubscriptionPlan) < getPlanLevel(currentPlan);

  function handleUpgrade() {
    if (isCurrent) return;

    if (plan.price > 0) {
      router.push(`/dashboard/subscription/checkout?plan=${plan.name}`);
    } else {
      // For free plan, handle directly
      router.push(`/dashboard/subscription/downgrade?plan=${plan.name}`);
    }
  }

  return (
    <Card className={plan.popular ? "relative border-primary shadow-lg" : ""}>
      {plan.popular && (
        <Badge className="-top-3 -translate-x-1/2 absolute left-1/2">
          Más Popular
        </Badge>
      )}
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <DynamicIcon name={plan.icon} className="h-8 w-8 text-primary" />
          {isCurrent && <Badge>Actual</Badge>}
        </div>
        <CardTitle className="text-2xl">{plan.title}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="font-bold text-4xl">
            ${plan.price.toLocaleString()}
          </span>
          {plan.price > 0 && (
            <span className="text-muted-foreground">/mes</span>
          )}
        </div>

        <div className="space-y-2">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
          {plan.limitations?.map((limitation) => (
            <div key={limitation} className="flex items-start gap-2 opacity-50">
              <span className="text-sm line-through">{limitation}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpgrade}
          disabled={isCurrent || isDowngrade}
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
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

function getPlanLevel(plan?: SubscriptionPlan | null): number {
  const levels = { FREE: 0, BASIC: 1, PREMIUM: 2 };
  return levels[plan || "FREE"];
}
