import type { UseMutationResult } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
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
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";

type DataTableDialogDeleteRowsSelectedProps<TData> = {
  rows: Row<TData>[];
  onRowAction?: UseMutationResult<
    {
      success: boolean;
    },
    Error,
    {
      id: string[];
    },
    unknown
  >;
};

export const DataTableDialogDeleteRowsSelected = <TData,>({
  rows,
  onRowAction,
}: DataTableDialogDeleteRowsSelectedProps<TData>) => {
  const handleDeleteRowsSelected = () => {
    if (onRowAction) {
      onRowAction.mutate({
        id: rows.map((row) => (row.original as { id: string }).id),
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={onRowAction?.isPending} variant="destructive">
          {onRowAction?.isPending
            ? "Eliminando filas..."
            : `Eliminar ${rows.length} ${rows.length === 1 ? "fila" : "filas"}`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {onRowAction?.isPending
              ? "Eliminando filas..."
              : `Eliminar ${rows.length}`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {onRowAction?.isPending
              ? "Eliminando filas..."
              : `¿Estás seguro de eliminar ${rows.length} filas seleccionadas?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteRowsSelected()}
            disabled={onRowAction?.isPending}
            className="bg-red-500 hover:bg-red-600/60 disabled:bg-red-500 disabled:text-white disabled:hover:bg-red-500"
          >
            {onRowAction?.isPending
              ? "Eliminando filas..."
              : `Eliminar ${rows.length} ${rows.length === 1 ? "fila" : "filas"}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
