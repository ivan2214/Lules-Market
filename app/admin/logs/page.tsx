import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { LogTable } from "@/app/admin/_components/log-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { db, schema } from "@/db";
import type { Log } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata } from "@/lib/metadata";

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
  cacheTag(CACHE_TAGS.ADMIN.LOGS.GET_ALL);

  const skip = (page - 1) * limit;

  // Build where conditions
  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        ilike(schema.log.action, `%${filters.search}%`),
        ilike(schema.log.entityType, `%${filters.search}%`),
        ilike(schema.log.adminId, `%${filters.search}%`),
      ),
    );
  }

  if (filters.entityType && filters.entityType !== "all") {
    conditions.push(eq(schema.log.entityType, filters.entityType));
  }

  if (filters.action && filters.action !== "all") {
    conditions.push(eq(schema.log.action, filters.action));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalLogsResult, logs] = await Promise.all([
    db.select({ count: count() }).from(schema.log).where(whereClause),
    db.query.log.findMany({
      where: whereClause,
      orderBy: [desc(schema.log.timestamp)],
      offset: skip,
      limit: limit,
    }),
  ]);

  const totalLogs = totalLogsResult[0]?.count ?? 0;

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
