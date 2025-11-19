"use client";

import { CheckCircle, Loader2, Mail, Store, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendVerificationEmail, verifyEmail } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "resend"
  >("loading");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasVerified = useRef(false); // evitar re-verificación

  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || hasVerified.current) return;

      hasVerified.current = true;
      startTransition(() => {
        verifyEmail({
          query: {
            token,
          },
        }).then((res) => {
          if (res.error) {
            setStatus("error");
            toast.error("Error al verificar el email");
          } else {
            setStatus("success");
            toast.success(
              "Email verificado exitosamente, redirigiendo a la pantalla de dashboard",
            );
          }
        });
      });
    };

    verifyToken();
  }, [token]);

  const handleResendEmail = () => {
    if (email) {
      startTransition(() => {
        sendVerificationEmail({
          email,
        }).then((res) => {
          if (res.error) {
            setStatus("error");
          } else {
            setStatus("resend");
          }
        });
      });
    }
  };

  // si no hay token en la URL, redirigir a la pantalla de login
  if (!token) {
    return (
      <div className="w-full max-w-md py-12">
        <div className="text-center">
          <Link
            href="/"
            className="mb-6 flex items-center justify-center space-x-2"
          >
            <Store className="h-8 w-8 text-red-600" />
            <span className="font-bold text-2xl">LulesMarket</span>
          </Link>
          <h2 className="font-bold text-3xl">Verificación de Email</h2>
        </div>
        <Card>
          <CardContent className="space-y-6 p-8 text-center">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-red-700 text-xl">
                Error de Verificación
              </h3>
              <p className="text-muted-foreground">
                El enlace de verificación es inválido o ha expirado.
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full bg-transparent">
                  Volver al Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthHeader
        title="Verificación de Email"
        subtitle="Completá los siguientes pasos para registrar tu comercio"
      />

      <Card>
        <CardContent className="space-y-6 p-8 text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-xl">
                  Verificando tu email...
                </h3>
                <p className="text-muted-foreground">
                  Por favor esperá mientras verificamos tu cuenta.
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-green-700 text-xl">
                  ¡Verificación Exitosa!
                </h3>
                <p className="text-muted-foreground">
                  Tu email ha sido verificado exitosamente. Tu cuenta está ahora
                  activa.
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h4 className="mb-2 font-medium text-green-900">
                  ¡Bienvenido a LulesMarket!
                </h4>
                <p className="text-green-800 text-sm">
                  Tu cuenta ha sido verificada. Ya podés iniciar sesión y
                  comenzar a gestionar tu comercio.
                </p>
              </div>
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full">Iniciar Sesión</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ir al Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-red-700 text-xl">
                  Error de Verificación
                </h3>
                <p className="text-muted-foreground">
                  El enlace de verificación es inválido o ha expirado. Podés
                  solicitar un nuevo enlace.
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h4 className="mb-2 font-medium text-red-900">
                  ¿Qué podés hacer?
                </h4>
                <ul className="space-y-1 text-left text-red-800 text-sm">
                  <li>• Verificá que el enlace esté completo</li>
                  <li>• El enlace puede haber expirado (válido por 24hs)</li>
                  <li>• Solicitá un nuevo email de verificación</li>
                  <li>• Contactanos si el problema persiste</li>
                </ul>
              </div>
              <div className="space-y-3">
                <Button
                  disabled={pending}
                  className="w-full"
                  onClick={() => setStatus("resend")}
                >
                  Solicitar Nuevo Email
                </Button>
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full bg-transparent">
                    Volver al Login
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === "resend" && (
            <>
              <div className="flex justify-center">
                <Mail className="h-16 w-16 text-blue-500" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-xl">
                  Reenviar Verificación
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Ingresá tu email para recibir un nuevo enlace de verificación.
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={handleResendEmail}
                  disabled={!email || pending}
                >
                  {pending ? "Enviando..." : "Reenviar Email"}
                </Button>
                <Button
                  disabled={pending}
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setStatus("error")}
                >
                  Volver
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
