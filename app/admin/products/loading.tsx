import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { Spinner } from "@/app/shared/components/ui/spinner";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Productos
        </h1>
        <p className="text-muted-foreground">
          Administra todos los productos de la plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <section className="flex flex-col items-start gap-y-5">
            <div>
              <Skeleton className="h-5 w-44" />
            </div>
            <section className="mx-auto">
              <Spinner className="size-5" />
            </section>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
