"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthHeader } from "@/app/auth/_components/auth-header";
import { Alert, AlertDescription } from "@/app/shared/components/ui/alert";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import { Card, CardContent } from "@/app/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/shared/components/ui/form";
import { Input } from "@/app/shared/components/ui/input";
import { forgetPassword } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [isPending, setPending] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordInput) => {
    setPending(true);

    try {
      const { error, data } = await forgetPassword({
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`, // This page will be created next
      });

      if (error || !data.status) {
        console.error("send reset password email has not worked", error);
        setMessage("Something went wrong. Please try again.");
        setIsSuccess(false);
      } else if (data.status) {
        setMessage("Check your email for the reset link.");
        setIsSuccess(true);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error("send reset password email has not worked", error);
      setIsSuccess(false);
    } finally {
      form.reset();
      setPending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="space-y-6 p-8 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>

              <div>
                <h2 className="mb-2 font-bold text-2xl text-green-700">
                  ¡Email Enviado!
                </h2>
                <p className="text-muted-foreground">
                  Te hemos enviado un enlace para restablecer tu contraseña a{" "}
                  <strong>{form.getValues("email")}</strong>
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                <h4 className="mb-2 font-medium text-blue-900">
                  Próximos pasos:
                </h4>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Revisá tu bandeja de entrada (y spam)</li>
                  <li>• Hacé click en el enlace del email</li>
                  <li>• Creá una nueva contraseña segura</li>
                  <li>• Iniciá sesión con tu nueva contraseña</li>
                </ul>
                <p className="mt-2 text-blue-700 text-xs">
                  <strong>Nota:</strong> El enlace expirará en 1 hora por
                  seguridad.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/auth/signin">
                  <Button className="w-full">Volver al Login</Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setMessage("");
                    setIsSuccess(false);
                    form.reset();
                  }}
                >
                  Enviar otro email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <AuthHeader
        title="Recuperar Contraseña"
        subtitle="Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña"
      />
      {/* Header */}

      {/* Form */}
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Te enviaremos un enlace seguro para restablecer tu contraseña.
                  El enlace expirará en 1 hora por seguridad.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Enviando..." : "Enviar Enlace de Recuperación"}
              </Button>

              {message && !isSuccess && (
                <Badge variant="destructive">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {message}
                </Badge>
              )}
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 font-medium text-primary text-sm hover:text-primary/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
