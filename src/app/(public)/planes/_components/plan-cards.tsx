"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Badge, Check, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/eden";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const PlanCards = () => {
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
    <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
      {plans?.map((plan) => {
        const Icon =
          plan.type === "FREE" ? Sparkles : plan.type === "BASIC" ? Zap : Crown;
        return (
          <Card
            key={plan.name}
            className={plan.popular ? "relative border-primary shadow-lg" : ""}
          >
            {plan.popular && (
              <Badge className="-top-3 -translate-x-1/2 absolute left-1/2">
                Más Popular
              </Badge>
            )}
            <CardHeader>
              <Icon className="mb-4 h-10 w-10 text-primary" />
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="font-bold text-4xl">
                  ${plan.price.toLocaleString()}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/mes</span>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href="/auth/sign-up">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
