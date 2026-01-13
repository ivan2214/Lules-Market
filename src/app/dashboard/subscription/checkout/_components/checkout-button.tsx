"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PlanType } from "@/db/types";
import { api } from "@/lib/eden";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface CheckoutButtonProps {
  plan: PlanType;
}

export function CheckoutButton({ plan }: CheckoutButtonProps) {
  const router = useRouter();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: async (json: { planType: PlanType }) => {
      const { data, error } = await api.payment.createPreference.post(json);
      if (error) throw error;
      return data;
    },
    onSuccess(data) {
      const { initPoint } = data;

      if (initPoint) {
        router.push(initPoint as Route);
      }

      toast.success("Pago iniciado");
    },
    onError(error) {
      toast.error(
        error instanceof Error ? error.message : "Error al procesar el pago",
      );
    },
  });

  const handleCheckout = () => {
    const planType = plan;
    mutate({ planType });
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isPending || !!isError}
      size="lg"
      className={cn("w-full", isPending && "cursor-not-allowed opacity-50")}
      variant={isError ? "destructive" : "default"}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending && "Procesando..."}
      {!isPending && !isError && "Continuar al Pago"}
      {!isPending && isError && <AlertTriangleIcon className="mr-2 h-4 w-4" />}
      {!isPending && isError && error.message}
    </Button>
  );
}
