import { orpcTanstack } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { TrialColumns } from "./_components/trial-columns";
import { TrialCreateFormDialog } from "./_components/trial-create-form-dialog";
import { TrialStats } from "./_components/trial-stats";

export default async function TrialsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    orpcTanstack.admin.getTrialsAndActiveCount.queryOptions(),
  );

  await queryClient.prefetchQuery(
    orpcTanstack.admin.getAllPlans.queryOptions(),
  );

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
        <HydrateClient client={queryClient}>
          <TrialCreateFormDialog />
        </HydrateClient>
      </div>

      <HydrateClient client={queryClient}>
        <TrialStats />
      </HydrateClient>

      <HydrateClient client={queryClient}>
        <TrialColumns />
      </HydrateClient>
    </div>
  );
}
