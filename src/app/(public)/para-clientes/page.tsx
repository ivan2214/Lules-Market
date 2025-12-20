import {
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Para Clientes - Encuentra todo en Lules Market",
  description:
    "La forma más fácil y rápida de encontrar productos y servicios en Lules. Sin scrollear infinitamente en grupos.",
};

export default function ParaClientesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container grow py-16">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            Encuentra lo que buscas, <br />
            <span className="text-primary">al instante</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            Olvídate de buscar en posts antiguos de Facebook. Lules Market es tu
            buscador local centralizado.
          </p>
        </div>

        <div className="mx-auto mb-20 grid max-w-5xl gap-8 md:grid-cols-3">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-bold text-xl">Búsqueda Inteligente</h3>
              <p className="text-muted-foreground">
                Busca específicamente por categoría, nombre del comercio o tipo
                de producto. Encuentra resultados precisos en segundos.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-bold text-xl">Ahorro de Tiempo</h3>
              <p className="text-muted-foreground">
                Más rápido que scrollear en grupos de Facebook preguntando
                "¿alguien sabe dónde venden...?". Aquí la información está lista
                para ti.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-bold text-xl">Confianza Local</h3>
              <p className="text-muted-foreground">
                Información detallada de cada comercio: ubicación, horarios y
                servicios. Conecta directamente con negocios reales de tu
                ciudad.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mb-16 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-bold text-3xl">
                ¿Por qué usar Lules Market?
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <span className="block font-semibold">
                      Cercanía con comercios locales
                    </span>
                    <span className="text-muted-foreground">
                      Fomentamos el consumo local conectándote con tus vecinos
                      comerciantes.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Smartphone className="mt-1 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <span className="block font-semibold">
                      Acceso desde cualquier dispositivo
                    </span>
                    <span className="text-muted-foreground">
                      Ya sea desde tu celular o computadora, la web siempre está
                      disponible.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <ThumbsUp className="mt-1 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <span className="block font-semibold">
                      Simple y sin vueltas
                    </span>
                    <span className="text-muted-foreground">
                      Sin registros complicados para buscar. Entras y
                      encuentras.
                    </span>
                  </div>
                </li>
              </ul>
              <div className="pt-4">
                <Button size="lg" asChild>
                  <Link href="/explorar/productos">
                    Ver Productos Disponibles
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted lg:aspect-square">
              {/* Placeholder for an image or graphic */}
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-secondary/20">
                <Search className="h-24 w-24 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
