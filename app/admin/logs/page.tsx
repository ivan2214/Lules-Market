import type { Metadata } from "next";
import { Suspense } from "react";
import { getLogs } from "@/app/data/admin/admin.dal";
import { LogTable } from "@/components/admin/log-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Logs del Sistema",
  description: "Visualiza y gestiona los logs de actividad del sistema.",
});

interface LogsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    entityType?: string;
    action?: string;
  }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const page = Number.parseInt((await searchParams).page || "1");
  const filters = {
    search: (await searchParams).search,
    entityType: (await searchParams).entityType,
    action: (await searchParams).action,
  };

  const { logs, totalPages, currentPage } = await getLogs(page, 10, filters);

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Logs de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Cargando logs...</p>}>
            <LogTable
              filtersParam={filters}
              logs={logs}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
