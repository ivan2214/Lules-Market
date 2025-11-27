"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useState } from "react";
import type { PaymentDTO } from "@/app/data/payment/payment.dto";
import type { WebhookEvent } from "@/app/generated/prisma/client";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PaymentStatusMP } from "@/types";

type PaymentsClientProps = {
  payments: PaymentDTO[];
  webhookEvents: WebhookEvent[];
};

export const PaymentsClient: React.FC<PaymentsClientProps> = ({
  payments,
  webhookEvents,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentDTO | null>(
    null,
  );

  const [open, setOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedPayment(null);
    }
  };

  const getStatusBadge = (status: PaymentStatusMP) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 text-white">Aprobado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rechazado</Badge>;
    }
  };

  const paymentColumns: ColumnDef<PaymentDTO>[] = [
    {
      accessorKey: "externalId",
      header: "ID Externo",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.id || "N/A"}</span>
      ),
    },
    {
      accessorKey: "business",
      header: "Negocio",
      cell: ({ row }) => row.original.business?.name || "N/A",
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => <Badge variant="outline">{row.original.plan}</Badge>,
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => (
        <span className="font-medium">
          ${(row.original.amount / 100).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "method",
      header: "Método",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.original.status as PaymentStatusMP),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-AR"),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedPayment(row.original);
            setOpen(true);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const webhookColumns: ColumnDef<WebhookEvent>[] = [
    {
      accessorKey: "eventType",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.eventType}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("es-AR"),
    },
    {
      accessorKey: "payload",
      header: "Payload",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-2 py-1 text-xs">
          {JSON.stringify(row.original.payload).substring(0, 50)}...
        </code>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={payments}
            columns={paymentColumns}
            searchPlaceholder="Buscar por negocio..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos de Webhook</CardTitle>
          <CardDescription>
            Auditoría de eventos de Mercado Pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={webhookEvents}
            columns={webhookColumns}
            searchPlaceholder="Buscar por tipo..."
          />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Pago</DialogTitle>
            <DialogDescription>Información completa del pago</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Estado
                </p>
                {getStatusBadge(selectedPayment?.status as PaymentStatusMP)}
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Negocio
                </p>
                <p>{selectedPayment?.business?.name}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Plan
                </p>
                <p>{selectedPayment?.plan}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Monto
                </p>
                <p className="font-bold text-lg">
                  ${((selectedPayment?.amount ?? 0) / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Método
                </p>
                <p>{selectedPayment?.paymentMethod}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-muted-foreground text-sm">
                  Fecha
                </p>
                <p>
                  {selectedPayment?.createdAt
                    ? new Date(selectedPayment?.createdAt).toLocaleString(
                        "es-AR",
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
