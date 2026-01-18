import { Calendar, Gift } from "lucide-react";
import { Suspense } from "react";
import { getAdminBusinesses } from "@/data/admin/entities-admin";
import { getTrialsAndActiveCount } from "@/data/admin/get";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CreateTrialForm } from "./_components/create-trial-form";
import { TrialActions } from "./_components/trial-actions";

export default function AdminGrantsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Otorgar Planes / Trials
        </h1>
        <p className="mt-2 text-muted-foreground">
          Asigna períodos de prueba a comercios registrados.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Crear Nuevo Trial
            </CardTitle>
            <CardDescription>
              Selecciona un comercio y asigna un plan por un período
              determinado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FormSkeleton />}>
              <CreateTrialFormWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Estadísticas de Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<StatsSkeleton />}>
              <TrialStats />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trials Activos</CardTitle>
          <CardDescription>
            Lista de todos los períodos de prueba vigentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <TrialsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function CreateTrialFormWrapper() {
  const businesses = await getAdminBusinesses({ page: 1, perPage: 100 });
  return <CreateTrialForm businesses={businesses} />;
}

async function TrialStats() {
  const { trials, activeTrials } = await getTrialsAndActiveCount();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border p-4">
        <div className="font-bold text-2xl">{activeTrials.length}</div>
        <p className="text-muted-foreground text-sm">Trials Activos</p>
      </div>
      <div className="rounded-lg border p-4">
        <div className="font-bold text-2xl">{trials.length}</div>
        <p className="text-muted-foreground text-sm">Trials Totales</p>
      </div>
    </div>
  );
}

async function TrialsTable() {
  const { trials } = await getTrialsAndActiveCount();

  if (trials.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay trials registrados.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Comercio</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Días Restantes</TableHead>
          <TableHead>Expira</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trials.map((trial) => (
          <TableRow key={trial.id}>
            <TableCell className="font-medium">
              {trial.business?.name || "N/A"}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  trial.plan === "PREMIUM"
                    ? "default"
                    : trial.plan === "BASIC"
                      ? "secondary"
                      : "outline"
                }
              >
                {trial.plan}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={trial.isActive ? "default" : "destructive"}>
                {trial.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>
              {trial.daysRemaining > 0 ? (
                <span
                  className={trial.daysRemaining <= 7 ? "text-orange-500" : ""}
                >
                  {trial.daysRemaining} días
                </span>
              ) : (
                <span className="text-red-500">Expirado</span>
              )}
            </TableCell>
            <TableCell>
              {trial.expiresAt
                ? new Date(trial.expiresAt).toLocaleDateString()
                : "N/A"}
            </TableCell>
            <TableCell className="text-right">
              <TrialActions trial={trial} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
