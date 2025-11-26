"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
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

const verifyTokenSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
});

type VerifyTokenValues = z.infer<typeof verifyTokenSchema>;

export function VerifyTokenForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<VerifyTokenValues>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  function onSubmit(data: VerifyTokenValues) {
    startTransition(() => {
      router.push(`/auth/verify?token=${data.token}`);
    });
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Token de verificación"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Procesando..." : "Verificar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
