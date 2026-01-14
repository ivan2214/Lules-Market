import {
  BarChart,
  CreditCard,
  Globe,
  LayoutDashboard,
  Split,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Futuro del Proyecto - Roadmap Lules Market",
  description:
    "Conoce las próximas funcionalidades y la visión a futuro de Lules Market. Pagos integrados, estadísticas y más.",
};

export default function RoadmapPage() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-y-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex justify-center">
          <Badge variant="outline" className="px-4 py-1 text-base">
            Roadmap 2024-2025
          </Badge>
        </div>
        <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
          Hacia dónde vamos
        </h1>
        <p className="mt-6 text-pretty text-lg text-muted-foreground">
          Lules Market es un proyecto vivo. Si la plataforma tiene buena
          adopción, esto es lo que planeamos implementar para potenciar aún más
          el comercio local.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
        {/* Phase 1: Short Term */}
        <div className="relative border-primary/20 border-l-2 pb-8 pl-8">
          <span className="-left-[9px] absolute top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
          <h2 className="mb-6 font-bold text-2xl text-primary">
            Próximamente: Pagos y Gestión
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CreditCard className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Pagos con Mercado Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Implementación de un sistema de pagos seguro para gestionar
                  suscripciones de comercios de manera automática y
                  transparente.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Split className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Split de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada comercio podrá configurar su propia cuenta de Mercado
                  Pago. A futuro, esto permitirá que cuando un cliente compre
                  algo, el pago vaya directo al comercio.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase 2: Medium Term */}
        <div className="relative border-primary/20 border-l-2 pb-8 pl-8">
          <span className="-left-[9px] absolute top-0 h-4 w-4 rounded-full bg-primary/50 ring-4 ring-background" />
          <h2 className="mb-6 font-bold text-2xl">
            Mediano Plazo: Herramientas para Comercios
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <BarChart className="mb-2 h-8 w-8 text-foreground" />
                <CardTitle>Estadísticas de Visitas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Métricas detalladas para que cada comercio sepa cuánta gente
                  visita su perfil, qué productos ven más y cómo mejorar su
                  oferta.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <LayoutDashboard className="mb-2 h-8 w-8 text-foreground" />
                <CardTitle>Panel de Gestión Avanzado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Un dashboard más completo para administrar stock, pausar
                  publicaciones, responder consultas y gestionar la identidad de
                  la marca.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase 3: Long Term */}
        <div className="relative border-primary/20 border-l-2 pl-8">
          <span className="-left-[9px] absolute top-0 h-4 w-4 rounded-full bg-muted-foreground ring-4 ring-background" />
          <h2 className="mb-6 font-bold text-2xl text-muted-foreground">
            Largo Plazo: Expansión
          </h2>
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Expansión a otras ciudades</CardTitle>
                  <CardDescription className="mt-2">
                    Si el modelo funciona exitosamente en Lules, evaluaremos
                    llevar la plataforma a ciudades vecinas, creando una red de
                    comercio local más amplia pero manteniendo la identidad de
                    cada comunidad.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <p className="mb-8 text-muted-foreground">
          ¿Tienes ideas o sugerencias para la plataforma?
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href="https://wa.me/5493815555555" target="_blank">
            Contactar al Desarrollador
          </Link>
        </Button>
      </div>
    </section>
  );
}
