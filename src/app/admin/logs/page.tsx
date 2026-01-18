import { ScrollText } from "lucide-react";
import { Suspense } from "react";
import { getAdminLogs } from "@/data/admin/logs-admin";
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
import { DeleteLogsButton } from "./_components/delete-logs-button";

export default function AdminLogsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Logs del Sistema
          </h1>
          <p className="mt-2 text-muted-foreground">
            Auditoría de todas las acciones realizadas en la plataforma.
          </p>
        </div>
        <DeleteLogsButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Registro de Actividad
          </CardTitle>
          <CardDescription>
            Historial completo de acciones del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <LogsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function LogsTable() {
  const { logs, total } = await getAdminLogs({ page: 1, perPage: 100 });

  if (logs.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay logs registrados.
      </div>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "default";
      case "BAN":
      case "DELETE":
        return "destructive";
      case "ACTIVATE":
        return "secondary";
      case "PAUSE":
      case "CANCEL":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case "USER":
        return "bg-blue-100 text-blue-800";
      case "BUSINESS":
        return "bg-green-100 text-green-800";
      case "PRODUCT":
        return "bg-purple-100 text-purple-800";
      case "TRIAL":
        return "bg-yellow-100 text-yellow-800";
      case "PLAN":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Entidad</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Entity ID</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 font-medium text-xs ${getEntityColor(log.entityType || "")}`}
                >
                  {log.entityType}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    getActionColor(log.action) as
                      | "default"
                      | "secondary"
                      | "outline"
                      | "destructive"
                  }
                >
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {log.entityId?.slice(0, 8)}...
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                {log.details ? JSON.stringify(log.details) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-muted-foreground text-sm">
        Mostrando {logs.length} de {total} logs
      </p>
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
