import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex flex-col gap-y-20 p-5 md:py-10">
      {/* Featured Products Skeleton */}
      <section>
        <div className="mb-8 flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-start gap-2">
            <Skeleton className="h-8 w-56 md:h-10 md:w-64" /> {/* Título */}
            <Skeleton className="h-4 w-72 md:h-5 md:w-96" /> {/* Descripción */}
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" /> {/* Botón */}
        </div>

        {/* Carrousel Skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={(i + 1).toString()}
              className="flex h-96 w-64 flex-col overflow-hidden rounded-xl border bg-background p-0"
            >
              {/* Imagen */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
                <Skeleton className="absolute top-2 right-2 h-6 w-16 rounded-md" />{" "}
                {/* Badge Destacado */}
              </div>

              {/* Contenido */}
              <CardContent className="flex flex-col gap-2 px-4 py-0">
                <Skeleton className="h-5 w-3/4" /> {/* Nombre */}
                <Skeleton className="h-4 w-full" /> {/* Descripción */}
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-5 w-24" /> {/* Precio */}
                  <Skeleton className="h-5 w-16 rounded-md" /> {/* Categoría */}
                </div>
              </CardContent>

              {/* Footer */}
              <CardFooter className="flex items-center gap-2 p-4 pt-0">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Logo */}
                <Skeleton className="h-4 w-32" /> {/* Nombre comercio */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Categorías Skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i.toString()}>
          <div className="mb-8 flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-8 w-48 md:h-10 md:w-56" />{" "}
            {/* Título categoría */}
            <Skeleton className="h-10 w-40 rounded-lg" /> {/* Botón */}
          </div>

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={(j + 1).toString()}
                className="flex w-[250px] flex-col gap-2"
              >
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
