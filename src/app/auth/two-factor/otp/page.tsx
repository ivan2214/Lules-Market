"use client";

import { OtpForm } from "@/shared/components/auth/otp-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function OtpPage() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Verificación TOTP</CardTitle>
        <CardDescription>
          Verifica tu identidad con un código de una vez
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpForm />
      </CardContent>
    </Card>
  );
}
