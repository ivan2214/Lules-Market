"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle } from "lucide-react";
import * as React from "react";
import type { User } from "@/db/types";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/shared/components/data-table/data-table-toolbar";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useDataTable } from "@/shared/hooks/use-data-table";
import { UserCreateDialog } from "./user-create";
import { UserListActions } from "./users-list-actions";

export function UsersList({
  data,
  pageCount,
}: {
  data: Array<User>;
  pageCount: number;
}) {
  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 0,
        enableSorting: false,
        enableHiding: false,
      },
      {
        // Required: Unique identifier for the column
        id: "name",
        // Required: Key to access the data, `accessorFn` can also be used
        accessorKey: "name",
        // Optional: Custom header component
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        // Optional: Custom cell component
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        // Optional: Meta options for filtering, sorting, and view options
        meta: {
          label: "Name",
          placeholder: "Search names...",
          variant: "text",
          icon: Text,
        },
        // By default, the column will not be filtered. Set to `true` to enable filtering.
        enableColumnFilter: true,
      },

      {
        id: "email",
        accessorKey: "email",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Email" />
        ),
        cell: ({ cell }) => {
          const email = cell.getValue<User["email"]>();

          return <div>{email}</div>;
        },
      },
      {
        id: "emailVerified",
        accessorKey: "emailVerified",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Email Verified" />
        ),
        cell: ({ cell }) => {
          const emailVerified = cell.getValue<User["emailVerified"]>();
          const Icon = emailVerified ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {emailVerified ? "Yes" : "No"}
            </Badge>
          );
        },
      },
      {
        id: "banned",
        accessorKey: "banned",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Banned" />
        ),
        cell: ({ cell }) => {
          const banned = cell.getValue<User["banned"]>();
          const Icon = banned ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {banned ? "Yes" : "No"}
            </Badge>
          );
        },
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Role" />
        ),
        cell: ({ cell }) => {
          const role = cell.getValue<User["role"]>();

          return <div className="flex items-center gap-1">{role}</div>;
        },
        meta: {
          label: "Role",
          variant: "select",
          options: [
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ cell }) => {
          const createdAt = cell.getValue<User["createdAt"]>();

          return (
            <div>
              {new Date(createdAt || "").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <UserListActions row={row} />,
        size: 32,
      },
    ],
    [],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <UserCreateDialog />
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
