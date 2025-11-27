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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PaymentStatusMP } from "@/types";

const getProcessedBadge = (processed: boolean) => {
  if (processed) {
    return <Badge variant="success">Procesado</Badge>; // Asume variante 'success'
  }
  return <Badge variant="destructive">Pendiente</Badge>; // Asume variante 'destructive'
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
  const [selectedWebhookEvent, setSelectedWebhookEvent] =
    useState<WebhookEvent | null>(null);

  const [open, setOpen] = useState(false);
  const [openWebhookEvent, setOpenWebhookEvent] = useState(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedPayment(null);
    }
  };

  const onOpenChangeWebhookEvent = (open: boolean) => {
    setOpenWebhookEvent(open);
    if (!open) {
      setSelectedWebhookEvent(null);
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
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("es-AR"),
    },
    {
      accessorKey: "eventType",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.eventType}</Badge>
      ),
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
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedWebhookEvent(row.original);
            setOpenWebhookEvent(true);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
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
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
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
      <Dialog open={openWebhookEvent} onOpenChange={onOpenChangeWebhookEvent}>
        <DialogContent className="sm:max-w-[800px]">
          {" "}
          {/* Ajusta el ancho para el JSON */}
          <DialogHeader>
            <DialogTitle>🔎 Detalles del Evento Webhook</DialogTitle>
            <DialogDescription>
              Información completa del evento recibido y su estado de
              procesamiento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            {/* Sección de Datos Principales (Grid) */}
            <div className="grid grid-cols-1 gap-6 rounded-lg border bg-gray-50/50 p-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Fila 1: ID y Request ID */}
              <div>
                <p className="font-semibold text-gray-600 text-sm">
                  ID Interno
                </p>
                <p className="break-all font-mono text-sm">
                  {selectedWebhookEvent?.id}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm">
                  ID de Petición (Request)
                </p>
                <p className="break-all font-mono text-sm">
                  {selectedWebhookEvent?.requestId}
                </p>
              </div>

              {/* Fila 2: Tipo de Evento y MP ID */}
              <div>
                <p className="font-semibold text-gray-600 text-sm">
                  Tipo de Evento
                </p>
                <p className="font-bold text-base text-blue-700">
                  {selectedWebhookEvent?.eventType}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm">
                  ID Externo (Mercado Pago)
                </p>
                <p className="text-base">
                  {selectedWebhookEvent?.mpId ?? "N/A"}
                </p>
              </div>

              {/* Fila 3: Creado y Procesado */}
              <div>
                <p className="font-semibold text-gray-600 text-sm">
                  Fecha de Recepción
                </p>
                <p className="text-sm">
                  {selectedWebhookEvent?.createdAt
                    ? new Date(selectedWebhookEvent.createdAt).toLocaleString(
                        "es-AR",
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm">
                  Estado de Procesamiento
                </p>
                {getProcessedBadge(selectedWebhookEvent?.processed ?? false)}
                <p className="mt-1 text-gray-500 text-xs">
                  {selectedWebhookEvent?.processedAt
                    ? `Finalizado: ${new Date(selectedWebhookEvent.processedAt).toLocaleString("es-AR")}`
                    : "Aún no procesado"}
                </p>
              </div>
            </div>

            {/* Sección de Payload (JSON) */}
            <div className="space-y-2">
              <p className="font-bold text-gray-700 text-lg">
                📜 Carga Útil (Payload JSON)
              </p>
              <ScrollArea className="h-60 w-full rounded-md border bg-gray-800 p-4 font-mono text-white text-xs">
                {/* Mostrar el JSON formateado */}
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedWebhookEvent?.payload, null, 2) ??
                    "Carga útil vacía"}
                </pre>
              </ScrollArea>
              <p className="text-gray-500 text-xs">
                Este es el contenido completo del evento enviado por el
                proveedor (ej. Mercado Pago).
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
