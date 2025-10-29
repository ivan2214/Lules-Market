import { cacheLife } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { TrialColumns } from "./components/trial-columns";
import { TrialCreateFormDialog } from "./components/trial-create-form-dialog";

async function getTrialsAndActiveCount() {
  const [trials, activeTrials] = await prisma.$transaction([
    prisma.trial.findMany({
      include: {
        business: true,
      },
    }),
    prisma.trial.findMany({ where: { isActive: true } }),
  ]);
  return {
    trials,
    activeTrials,
  };
}

export default async function TrialsPage() {
  "use cache";
  cacheLife("hours");
  const { activeTrials, trials } = await getTrialsAndActiveCount();

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

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
              {
                activeTrials.filter(
                  (t) =>
                    getDaysRemaining(t.expiresAt) <= 3 &&
                    getDaysRemaining(t.expiresAt) > 0,
                ).length
              }
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
