"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import type { VerificationStatus } from "../types/verification.types";
import { ResendEmailForm } from "./resend-email-form";
import { TokenForm } from "./token-form";
import { VerificationError } from "./verification-error";
import { VerificationPending } from "./verification-pending";
import { VerificationSuccess } from "./verification-success";
import { VerificationVerifying } from "./verification-verifying";

interface EmailVerificationCardProps {
  initialStatus?: VerificationStatus;
  email?: string;
  error?: string;
  token?: string;
}

export function EmailVerificationCard({
  initialStatus = "pending",
  email,
  error: initialError,
  token,
}: EmailVerificationCardProps) {
  const [status, setStatus] = useState<VerificationStatus>(initialStatus);
  const [error, setError] = useState<string | undefined>(initialError);

  const verifyToken = useCallback(async (verificationToken: string) => {
    setStatus("verifying");

    try {
      const { error: verifyError } = await authClient.verifyEmail({
        query: {
          token: verificationToken,
        },
      });

      if (verifyError) {
        setStatus("error");
        setError(verifyError.message || "Error al verificar el token");
      } else {
        setStatus("verified");
        setError(undefined);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error de conexión");
    }
  }, []);

  useEffect(() => {
    if (token && status === "pending") {
      verifyToken(token);
    }
  }, [token, status, verifyToken]);

  const handleRetry = () => {
    setStatus("pending");
    setError(undefined);
  };

  const handleStatusChange = (
    newStatus: "verifying" | "verified" | "error",
    newError?: string,
  ) => {
    setStatus(newStatus);
    if (newError) setError(newError);
  };

  const showForms =
    status === "pending" || status === "error" || status === "expired";

  return (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardContent className="space-y-6 p-8">
        {status === "verifying" && <VerificationVerifying />}
        {status === "pending" && <VerificationPending email={email} />}
        {status === "verified" && <VerificationSuccess />}
        {status === "error" && (
          <VerificationError error={error} onRetry={handleRetry} />
        )}
        {status === "expired" && (
          <VerificationError
            error="El enlace de verificación ha expirado. Por favor, solicita uno nuevo."
            onRetry={handleRetry}
          />
        )}

        {showForms && (
          <>
            <Separator />
            <Tabs defaultValue="token" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="token">Tengo un código</TabsTrigger>
                <TabsTrigger value="resend">Reenviar correo</TabsTrigger>
              </TabsList>
              <TabsContent value="token" className="mt-4">
                <TokenForm onStatusChange={handleStatusChange} />
              </TabsContent>
              <TabsContent value="resend" className="mt-4">
                <ResendEmailForm defaultEmail={email} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
