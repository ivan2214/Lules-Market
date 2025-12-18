"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/shared/components/ui/button";
import { Card, CardContent } from "@/app/shared/components/ui/card";

export function InvalidTokenState() {
  return (
    <div className="w-full max-w-md py-12">
      <Card>
        <CardContent className="space-y-6 p-8 text-center">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-red-700 text-xl">
              Enlace Inválido
            </h3>
            <p className="text-muted-foreground">
              El enlace de restablecimiento es inválido o está incompleto.
            </p>
          </div>
          <Link href="/auth/forgot-password">
            <Button className="w-full">Solicitar Nuevo Enlace</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
