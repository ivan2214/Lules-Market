import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function BusinessLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Perfil del Negocio
        </h1>
        <p className="text-muted-foreground">
          Administra la información pública de tu negocio
        </p>
      </div>

      {/* Share Link Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border p-6 sm:flex-row sm:justify-between">
            <div className="w-full space-y-1">
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="mb-4 h-4 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <Skeleton className="h-[150px] w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
          <CardDescription>
            Esta información será visible para todos los usuarios que visiten tu
            perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Nombre y Categoría */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Negocio *</Label>
                <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Skeleton className="h-10 w-full rounded-md" /> {/* Select */}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>

              <Skeleton className="h-24 w-full rounded-md" />
            </div>

            {/* Dirección y Teléfono */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>

                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>

                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Email y Website */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>

                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Horarios */}
            <div className="space-y-2">
              <Label htmlFor="hours">Horarios de Atención</Label>

              <Skeleton className="h-20 w-full rounded-md" />
            </div>

            {/* Redes Sociales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Redes Sociales</h3>

              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i.toString()} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Imágenes</h3>

              <div className="flex items-center justify-evenly">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-20 w-20 rounded-full" />{" "}
                  {/* Avatar uploader */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-24 w-40 rounded-md" />{" "}
                  {/* Cover uploader */}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
