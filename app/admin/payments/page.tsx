"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, Eye } from "lucide-react";
import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPayments, mockWebhookEvents } from "@/lib/data/mock-data";
import type { Payment, PaymentStatus, WebhookEvent } from "@/types/admin";

export default function PaymentsPage() {
  const [payments] = useState(mockPayments);
  const [webhookEvents] = useState(mockWebhookEvents);
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 text-white">Aprobado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rechazado</Badge>;
    }
  };

  const paymentColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "externalId",
      header: "ID Externo",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.externalId || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Negocio",
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
      cell: ({ row }) => getStatusBadge(row.original.status),
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPayment(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Pago</DialogTitle>
              <DialogDescription>
                Información completa del pago
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    ID Externo
                  </p>
                  <p className="font-mono text-sm">{row.original.externalId}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Estado
                  </p>
                  {getStatusBadge(row.original.status)}
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Negocio
                  </p>
                  <p>{row.original.businessName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Plan
                  </p>
                  <p>{row.original.plan}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Monto
                  </p>
                  <p className="font-bold text-lg">
                    ${(row.original.amount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Método
                  </p>
                  <p>{row.original.method}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Fecha
                  </p>
                  <p>
                    {new Date(row.original.createdAt).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const webhookColumns: ColumnDef<WebhookEvent>[] = [
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge className="bg-green-600 text-white">{row.original.status}</Badge>
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

  const totalRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Pagos y Facturación
          </h1>
          <p className="text-muted-foreground">
            Gestiona todos los pagos y eventos de webhook
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {payments.filter((p) => p.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-yellow-600">
              {payments.filter((p) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as typeof filter)}
      >
        <TabsList>
          <TabsTrigger value="all">Todos ({payments.length})</TabsTrigger>
          <TabsTrigger value="approved">
            Aprobados ({payments.filter((p) => p.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes ({payments.filter((p) => p.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rechazados ({payments.filter((p) => p.status === "rejected").length}
            )
          </TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pagos</CardTitle>
              <CardDescription>
                {filteredPayments.length} pago
                {filteredPayments.length !== 1 ? "s" : ""} encontrado
                {filteredPayments.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredPayments}
                columns={paymentColumns}
                searchPlaceholder="Buscar por negocio..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
