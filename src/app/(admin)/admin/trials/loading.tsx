import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";
import { TrialCreateFormDialog } from "./_components/trial-create-form-dialog";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Pruebas Gratuitas
          </h1>
          <p className="text-muted-foreground">
            Gestiona las pruebas gratuitas de los negocios
          </p>
        </div>
        <TrialCreateFormDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Trials Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Por Expirar (3 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pruebas Gratuitas</CardTitle>
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
