"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthHeader } from "@/components/auth/auth-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    token: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState({
    message: "",
    pending: false,
    success: false,
  });

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      confirmPassword: "",
      password: "",
    },
  });
  const handleSubmit = async (values: ResetPasswordInput) => {
    if (!token) return;

    setState({
      ...state,
      pending: true,
    });
    try {
      const { error, data } = await resetPassword({
        token,
        newPassword: values.password,
      });

      if (error?.message || !data?.status) {
        setState((old) => ({
          ...old,
          message: error?.message || "Something went wrong. Please try again.",
          success: false,
        }));
        return;
      }
      setState((old) => ({
        ...old,
        message:
          "Password reset successfully. Password reset! You can now sign in. Redirecting...",
        success: data.status || true,
      }));
      setTimeout(() => router.push("/auth/signin"), 4000);
    } catch (error) {
      setState((old) => ({
        ...old,
        message: "Something went wrong. Please try again.",
        success: false,
      }));
      console.error("reset password has not worked", error);
    } finally {
      setState((old) => ({
        ...old,
        pending: false,
      }));
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token) {
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

  if (state.success) {
    return (
      <div className="w-full max-w-md py-12">
        <Card>
          <CardContent className="space-y-6 p-8 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <div>
              <h2 className="mb-2 font-bold text-2xl text-green-700">
                ¡Contraseña Actualizada!
              </h2>
              <p className="text-muted-foreground">
                Tu contraseña ha sido actualizada exitosamente. Ya podés iniciar
                sesión con tu nueva contraseña.
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="mb-2 font-medium text-green-900">
                Consejos de seguridad:
              </h4>
              <ul className="space-y-1 text-left text-green-800 text-sm">
                <li>• Usá una contraseña única para cada cuenta</li>
                <li>• No compartas tu contraseña con nadie</li>
                <li>• Considerá usar un gestor de contraseñas</li>
                <li>• Cerrá sesión en dispositivos públicos</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/auth/signin">
                <Button className="w-full">Iniciar Sesión</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Ir al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <AuthHeader
        title="Restablecer Contraseña"
        subtitle="Ingresá tu nueva contraseña segura"
      />

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Restablecer Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {state.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Nueva Contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Consejos para una contraseña segura:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Al menos 8 caracteres</li>
                    <li>• Combiná letras, números y símbolos</li>
                    <li>• Evitá información personal</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={state.pending}>
                {state.pending ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-primary text-sm hover:text-primary/50"
            >
              Volver al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
