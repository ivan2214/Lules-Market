"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/shared/components/table/data-table-pagination";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { DataTableDialogDeleteRowsSelected } from "./data-table-dialog-delete-rows-selected";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  onRowAction,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
  });

  const rowsSelected = table.getFilteredSelectedRowModel().rows;
  const showRowActions = rowsSelected.length > 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
      </div>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-in-out",
          showRowActions ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 text-muted-foreground text-sm">
              {rowsSelected.length} de {table.getFilteredRowModel().rows.length}{" "}
              filas seleccionadas.
            </div>
            <DataTableDialogDeleteRowsSelected
              onRowAction={onRowAction}
              rows={rowsSelected}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md overflow-x-scroll rounded-md border md:max-w-3xl">
        <Table className="table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
