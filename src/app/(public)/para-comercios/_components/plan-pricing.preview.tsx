"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/eden";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

export const PlanPricingPreview = () => {
  const {
    data: { data: plans },
  } = useSuspenseQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await api.plan.public["list-all"].get();
      return response;
    },
  });

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
      {plans?.map((plan) => (
        <Card
          key={plan.type}
          className={cn(
            "relative",
            plan.type === "BASIC" && "border-primary shadow-lg",
          )}
        >
          <CardContent className="flex h-full flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-bold text-2xl">{plan.name}</h3>
              <p className="mt-2 font-bold text-3xl">
                ARS{formatCurrency(plan.price, "ARS")}
              </p>
              <p className="text-muted-foreground text-sm">{plan.type}</p>
            </div>
            <ul className="mb-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="w-full"
              variant={plan.type === "BASIC" ? "default" : "outline"}
            >
              <Link href="/auth/sign-up">Comenzar Gratis</Link>
            </Button>
            {plan.type === "BASIC" && (
              <Badge className="-top-3 -right-3 absolute">Más Popular</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
