import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LoadingProducts() {
  return (
    <main className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">Productos</h1>
          <Skeleton className="h-4 w-32" /> {/* Subtitle */}
        </div>

        {/* Botón agregar producto */}
        <Skeleton className="h-10 w-40 rounded-md" />
      </header>

      {/* Grid de productos */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-0">
            <CardHeader className="p-0">
              {/* Imagen */}
              <Skeleton className="h-40 w-full rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* Nombre producto */}
              <Skeleton className="h-5 w-3/4" />

              {/* Categoría */}
              <Skeleton className="h-4 w-1/2" />

              {/* Acciones */}
              <div className="flex gap-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
