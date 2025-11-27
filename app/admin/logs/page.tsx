import type { Metadata } from "next";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import type { Log, Prisma } from "@/app/generated/prisma/client";
import { LogTable } from "@/components/admin/log-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata } from "@/lib/metadata";
import prisma from "@/lib/prisma";

export async function getLogs(
  page = 1,
  limit = 10,
  filters: { search?: string; entityType?: string; action?: string } = {},
): Promise<{
  logs: Log[];
  totalPages: number;
  currentPage: number;
}> {
  "use cache";
  cacheTag(CACHE_TAGS.ADMIN_LOGS);

  const skip = (page - 1) * limit;
  const where: Prisma.LogWhereInput = {};

  if (filters.search) {
    where.OR = [
      { action: { contains: filters.search, mode: "insensitive" } },
      { entityType: { contains: filters.search, mode: "insensitive" } },
      { adminId: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  // ✅ Ignora "all" como valor válido
  if (filters.entityType && filters.entityType !== "all") {
    where.entityType = filters.entityType;
  }

  if (filters.action && filters.action !== "all") {
    where.action = filters.action;
  }

  const totalLogs = await prisma.log.count({ where });
  const logs = await prisma.log.findMany({
    where,
    orderBy: { timestamp: "desc" },
    skip,
    take: limit,
  });

  return {
    logs,
    totalPages: Math.ceil(totalLogs / limit),
    currentPage: page,
  };
}

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
  const page = Number.parseInt((await searchParams).page || "1", 10);
  const filters = {
    search: (await searchParams).search,
    entityType: (await searchParams).entityType,
    action: (await searchParams).action,
  };

  const { logs, totalPages, currentPage } = await getLogs(page, 10, filters);

  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Logs de Actividad</CardTitle>
        </CardHeader>
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
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
