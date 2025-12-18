"use client";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Eye, Search, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/shared/components/ui/alert-dialog";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/shared/components/ui/dialog";
import { Input } from "@/app/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/components/ui/table";
import type { Log } from "@/db/types";
import { orpc } from "@/lib/orpc";

interface LogTableProps {
  logs: Log[];
  totalPages: number;
  currentPage: number;
  filtersParam?: {
    search?: string;
    entityType?: string;
    action?: string;
  };
}

export function LogTable({
  filtersParam,
  logs,
  totalPages,
  currentPage,
}: LogTableProps) {
  const [pending, startTransition] = useTransition();

  const [filters, setFilters] = useState(
    filtersParam || {
      search: "",
      entityType: "all",
      action: "all",
    },
  );

  // biome-ignore lint/suspicious/noExplicitAny: <>
  const [selectedLogDetails, setSelectedLogDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.entityType && filters.entityType !== "all")
      params.set("entityType", filters.entityType);
    if (filters.action && filters.action !== "all")
      params.set("action", filters.action);
    params.set("page", "1");
    window.location.search = params.toString();
  };

  const onPageChange = (newPage: number) => {
    // biome-ignore lint/suspicious/noExplicitAny: <temp>
    const params = new URLSearchParams(searchParams as any);
    params.set("page", newPage.toString());
    window.location.search = params.toString();
  };

  const uniqueEntityTypes = Array.from(
    new Set(logs.map((log) => log.entityType).filter(Boolean)),
  ) as string[];
  const uniqueActions = Array.from(
    new Set(logs.map((log) => log.action).filter(Boolean)),
  ) as string[];

  // biome-ignore lint/suspicious/noExplicitAny: <temp>
  const handleViewDetails = (details: any) => {
    setSelectedLogDetails(details);
    setIsModalOpen(true);
  };

  const handleDeleteAllLogs = () => {
    startTransition(() => {
      orpc.admin.deleteAllLogs();
    });
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Buscar por acciÃ³n, usuario, etc."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="grow"
          type="search"
        />
        <Select
          value={filters.entityType}
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, entityType: val }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Entidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {uniqueEntityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.action}
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, action: val }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="AcciÃ³n" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {uniqueActions.map((act) => (
              <SelectItem key={act} value={act}>
                {act}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleApplyFilters}>
          <Search className="mr-2 h-4 w-4" /> Aplicar Filtros
        </Button>
      </div>

      {logs.length > 0 && (
        <section className="flex items-center justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={pending}>
                <Trash2 className="h-4 w-4" />
                Eliminar todos los registros
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Estas seguro de eliminar todos los registros?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acciÃ³n no se puede deshacer. Es permanente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  disabled={pending}
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => handleDeleteAllLogs()}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      )}

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>AcciÃ³n</TableHead>

              <TableHead>Tipo Entidad</TableHead>
              <TableHead>ID Entidad</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.action}</Badge>
                  </TableCell>
                  <TableCell>{log.entityType || "N/A"}</TableCell>
                  <TableCell>{log.entityId || "N/A"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs">
                    {log.details ? JSON.stringify(log.details) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(log.details)}
                      disabled={!log.details}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron logs.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PaginaciÃ³n */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Modal de detalles */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[400px] overflow-y-scroll sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalles del Log</DialogTitle>
            <DialogDescription>
              AquÃ­ puedes ver los detalles completos del log seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedLogDetails ? (
              <pre className="whitespace-pre-wrap break-all rounded-md bg-muted p-4 text-sm">
                {JSON.stringify(selectedLogDetails, null, 2)}
              </pre>
            ) : (
              <p>No hay detalles disponibles para este log.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
