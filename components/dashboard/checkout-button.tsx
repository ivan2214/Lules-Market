"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createPaymentPreference } from "@/app/actions/payment-actions";
import type { SubscriptionPlan } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  plan: SubscriptionPlan;
}

export function CheckoutButton({ plan }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    try {
      const { initPoint } = await createPaymentPreference(plan);

      // In development, use sandbox
      const checkoutUrl = initPoint;

      if (checkoutUrl) {
        router.push(checkoutUrl);
      }
    } catch (error) {
      console.error(" Error creating preference:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al procesar el pago",
      );
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      size="lg"
      className="w-full"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Continuar al Pago
    </Button>
  );
}
