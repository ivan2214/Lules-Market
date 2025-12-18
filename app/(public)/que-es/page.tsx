import { MapPin, Store, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/shared/components/ui/button";
import { Card, CardContent } from "@/app/shared/components/ui/card";

export const metadata: Metadata = {
  title: "¿Qué es Lules Market? - La solución para el comercio local",
  description:
    "Lules Market nace para conectar comercios locales con clientes de forma simple y centralizada en Lules, Tucumán.",
};

export default function QueEsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container grow py-16">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            Una solución digital para Lules
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            Conectando vecinos con comercios locales de manera simple y
            efectiva.
          </p>
        </div>

        <div className="mx-auto mb-20 grid max-w-5xl gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="font-bold text-2xl">El Problema</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              En Lules, Tucumán, cientos de personas buscan diariamente
              productos o servicios en grupos de Facebook. Sin embargo, la
              mayoría de los comercios no cuenta con una página web, lo que
              provoca que se pierdan muchas ventas potenciales y que posibles
              clientes no lleguen a los locales físicos ni contraten los
              servicios ofrecidos.
            </p>
          </div>

          <div className="space-y-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Store className="h-6 w-6" />
            </div>
            <h2 className="font-bold text-2xl">La Solución</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Esta plataforma nace para resolver ese problema: funciona como una
              <span className="font-medium text-foreground">
                {" "}
                vitrina digital{" "}
              </span>
              que permite a los comercios llegar a más clientes de manera simple
              y centralizada, sin depender exclusivamente de redes sociales.
            </p>
          </div>
        </div>

        <div className="mx-auto mb-16 max-w-4xl">
          <Card className="overflow-hidden border-none bg-primary/5 shadow-none">
            <CardContent className="grid gap-8 p-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  Público Objetivo
                </h3>
                <p className="text-muted-foreground">
                  Pensado tanto para <strong>comercios</strong> que desean
                  modernizarse y tener presencia web, como para{" "}
                  <strong>clientes finales</strong> que buscan comodidad y
                  rapidez al encontrar lo que necesitan en su ciudad.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-xl">
                  <MapPin className="h-5 w-5 text-primary" />
                  Alcance Geográfico
                </h3>
                <p className="text-muted-foreground">
                  Inicialmente enfocado exclusivamente en{" "}
                  <strong>Lules, Tucumán</strong>, asegurando una comunidad
                  activa y relevante para todos los usuarios locales.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 text-center">
          <h3 className="font-bold text-2xl">¿Quieres ser parte?</h3>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/explorar/comercios">Explorar Comercios</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/para-comercios">Registrar mi Negocio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
