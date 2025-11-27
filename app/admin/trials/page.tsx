import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { TrialColumns } from "./components/trial-columns";
import { TrialCreateFormDialog } from "./components/trial-create-form-dialog";

async function getTrialsAndActiveCount() {
  "use cache";
  cacheLife("hours");
  cacheTag("trials-page");

  const now = new Date(); // <-- permitido aquí

  const [trials, activeTrials] = await Promise.all([
    prisma.trial.findMany({ include: { business: true } }),
    prisma.trial.findMany({ where: { isActive: true } }),
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

        <CardContent>
          <TrialColumns
            trials={trials.map((trial) => ({
              ...trial,
              businessName: trial.business.name,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
