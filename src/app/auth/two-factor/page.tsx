"use client";

import Link from "next/link";

import { TwoFactorForm } from "@/shared/components/auth/two-factor-form";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function TwoFactorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificación TOTP</CardTitle>
        <CardDescription>
          Introduce tu 6-dígito código TOTP para autenticarte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwoFactorForm />
      </CardContent>
      <CardFooter className="gap-2 text-muted-foreground text-sm">
        <Link href="/auth/two-factor/otp">
          <Button variant="link" size="sm">
            Cambiar a verificación por correo electrónico
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
