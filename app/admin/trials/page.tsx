import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { TrialColumns } from "./_components/trial-columns";
import { TrialCreateFormDialog } from "./_components/trial-create-form-dialog";

async function getTrialsAndActiveCount() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ADMIN.TRIALS.GET_ALL);

  const now = new Date();

  const [trials, activeTrials] = await Promise.all([
    db.query.trial.findMany({
      with: { business: true },
    }),
    db.query.trial.findMany({
      where: eq(schema.trial.isActive, true),
    }),
  ]);

  const calculateDaysRemaining = (endDate: Date) => {
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return {
    trials: trials.map((t) => ({
      ...t,
      daysRemaining: calculateDaysRemaining(t.expiresAt),
    })),
    activeTrials: activeTrials.map((t) => ({
      ...t,
      daysRemaining: calculateDaysRemaining(t.expiresAt),
    })),
  };
}

export default async function TrialsPage() {
  const { activeTrials, trials } = await getTrialsAndActiveCount();

  const expiringSoon = activeTrials.filter(
    (t) => t.daysRemaining <= 3 && t.daysRemaining > 0,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-y-2 lg:flex-row lg:items-center lg:justify-between">
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
            <div className="font-bold text-2xl">{trials.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Trials Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {activeTrials.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Por Expirar (3 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-yellow-600">
              <Suspense fallback={<Skeleton className="h-8 w-8" />}>
                {expiringSoon}
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pruebas Gratuitas</CardTitle>
          <CardDescription>{trials.length} trials registrados</CardDescription>
        </CardHeader>

        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
          <TrialColumns
            trials={trials.map((trial) => ({
              ...trial,
              businessName: trial.business?.name ?? "Sin negocio",
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
