"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendVerificationEmail, verifyEmail } from "@/lib/auth-client";

interface VerifyStatusProps {
  token: string;
}

const resendEmailSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ResendEmailValues = z.infer<typeof resendEmailSchema>;

export function VerifyStatus({ token }: VerifyStatusProps) {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "resend"
  >("loading");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const hasVerified = useRef(false);

  // Form for resending email
  const form = useForm<ResendEmailValues>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyEmail({
      query: {
        token,
      },
    }).then((res) => {
      if (res.error) {
        setStatus("error");
        console.error(res.error);
        toast.error("Error al verificar el email");
      } else {
        setStatus("success");
        toast.success(
          "Email verificado exitosamente, redirigiendo a la pantalla de dashboard",
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    });
  }, [token, router]);

  const onResendSubmit = (data: ResendEmailValues) => {
    startTransition(() => {
      sendVerificationEmail({
        email: data.email,
      }).then((res) => {
        if (res.error) {
          setStatus("error");
          toast.error("Error al reenviar el email");
        } else {
          toast.success("Email reenviado exitosamente");
          form.reset();
        }
      });
    });
  };

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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onResendSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="tu@email.com"
                            {...field}
                            disabled={pending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "Enviando..." : "Reenviar Email"}
                  </Button>
                  <Button
                    type="button"
                    disabled={pending}
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setStatus("error")}
                  >
                    Volver
                  </Button>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
