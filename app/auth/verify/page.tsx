"use client";

import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { sendVerificationEmail, verifyEmail } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "resend"
  >("loading");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasVerified = useRef(false); // evitar re-verificación

  const [manualToken, setManualToken] = useState(token || "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const verifyToken = async () => {
    if ((!token && !manualToken) || hasVerified.current) return;
    const tokenSend = token || manualToken;
    hasVerified.current = true;
    startTransition(() => {
      verifyEmail({
        query: {
          token: tokenSend.trim(),
        },
      }).then((res) => {
        if (res.error) {
          setStatus("error");
          console.log(res.error);

          toast.error("Error al verificar el email");
        } else {
          setStatus("success");
          toast.success(
            "Email verificado exitosamente, redirigiendo a la pantalla de dashboard",
          );
          router.push("/dashboard");
        }
      });
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (token) {
      verifyToken();
    }
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
            toast.success("Email reenviado exitosamente");
            router.push("/auth/verify");
          }
        });
      });
    }
  };

  // si no hay token en la URL, mostrar form para poner el token manualmente
  if (!token) {
    return (
      <div className="w-full max-w-md">
        <AuthHeader
          title="Verificación de Email"
          subtitle="Agregar el token de verificación manualmente"
        />
        <Card>
          <CardContent className="space-y-6 p-8 text-center">
            <div className="flex justify-center">
              <Mail className="h-16 w-16 text-blue-500" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-xl">
                Verificación de Email
              </h3>
              <p className="text-muted-foreground">
                Por favor, ingresa el token de verificación que recibiste en tu
                email.
              </p>
            </div>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Token de verificación"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
              />
              <Button onClick={verifyToken} disabled={pending}>
                {pending && <Spinner className="mr-2 h-4 w-4" />}
                {pending ? "Enviando..." : "Verificar"}
              </Button>
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
