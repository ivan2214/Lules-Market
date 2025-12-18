import { BarChart3, QrCode, Star, Store, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cómo Funciona - Lules Market",
  description:
    "Descubre lo fácil que es llevar tu negocio local al mundo digital en solo 3 pasos. Aprende a usar nuestra plataforma para aumentar tu visibilidad.",
  keywords: "cómo funciona, guía, pasos, marketplace local, vender online",
  openGraph: {
    title: "Cómo Funciona - Lules Market",
    description:
      "Descubre lo fácil que es llevar tu negocio local al mundo digital en solo 3 pasos.",
    url: "https://lules-market.vercel.app/como-funciona",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo Funciona - Lules Market",
    description:
      "Descubre lo fácil que es llevar tu negocio local al mundo digital en solo 3 pasos.",
  },
  alternates: {
    canonical: "https://lules-market.vercel.app/como-funciona",
  },
};

export default function ComoFuncionaPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          ¿Cómo Funciona?
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
          Descubre lo fácil que es llevar tu negocio local al mundo digital en
          solo 3 pasos
        </p>
      </div>

      <div className="mb-16 grid gap-8 md:grid-cols-3">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">1. Crea tu Perfil</h3>
                <p className="text-muted-foreground">
                  Regístrate y completa la información de tu negocio en minutos.
                  Agrega fotos, horarios y descripción.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">2. Comparte tu Enlace</h3>
                <p className="text-muted-foreground">
                  Obtén un enlace único y código QR para compartir en redes
                  sociales, WhatsApp o imprimirlo en tu local.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">3. Crece tu Negocio</h3>
                <p className="text-muted-foreground">
                  Recibe reseñas, analiza estadísticas y conecta con más
                  clientes. Todo desde un solo lugar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16 space-y-12">
        <div className="text-center">
          <h2 className="mb-8 font-bold text-3xl">
            Funcionalidades Principales
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Perfil de Negocio Completo
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Muestra toda la información de tu negocio: ubicación,
                    horarios, contacto, fotos y más. Todo en una página
                    profesional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Catálogo de Productos
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Muestra tus productos o servicios con fotos, descripciones y
                    precios. Tus clientes pueden ver todo lo que ofreces.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Reseñas y Encuestas</h3>
                  <p className="text-muted-foreground text-sm">
                    Recopila opiniones de tus clientes con encuestas
                    personalizadas. Mejora tu servicio con feedback real.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Análisis y Estadísticas
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Visualiza visitas, interacciones y tendencias. Toma
                    decisiones informadas para hacer crecer tu negocio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Código QR Personalizado
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Genera un código QR único para tu negocio. Imprímelo en tu
                    local o menús para que los clientes te encuentren
                    fácilmente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Fácil de Compartir</h3>
                  <p className="text-muted-foreground text-sm">
                    Comparte tu perfil en WhatsApp, Facebook, Instagram o
                    cualquier red social con un solo clic.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 p-8 text-center">
        <h2 className="mb-4 font-bold text-2xl">¿Listo para empezar?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          Únete a cientos de negocios locales que ya están creciendo con nuestra
          plataforma. Es gratis para comenzar.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/signup">Crear Cuenta Gratis</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/planes">Ver Planes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
