import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  XCircle,
} from "lucide-react";
import { Suspense } from "react";
import {
  getAdminPayments,
  getAdminPaymentsStats,
} from "@/data/admin/payments-admin";
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

export default function AdminPaymentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Pagos de Comercios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Historial de todos los pagos realizados por los comercios.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <PaymentStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Todos los pagos registrados en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <PaymentsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function PaymentStats() {
  const stats = await getAdminPaymentsStats();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        icon={DollarSign}
        title="Total Pagos"
        value={stats.total}
        color="text-blue-500"
      />
      <StatCard
        icon={CheckCircle}
        title="Aprobados"
        value={stats.approved}
        color="text-green-500"
      />
      <StatCard
        icon={Clock}
        title="Pendientes"
        value={stats.pending}
        color="text-yellow-500"
      />
      <StatCard
        icon={XCircle}
        title="Rechazados"
        value={stats.rejected}
        color="text-red-500"
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}

async function PaymentsTable() {
  const { payments, total } = await getAdminPayments({ page: 1, perPage: 50 });

  if (payments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay pagos registrados.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Comercio</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {payment.business?.name || "N/A"}
              </TableCell>
              <TableCell>
                ${payment.amount.toLocaleString()} {payment.currency}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{payment.plan}</Badge>
              </TableCell>
              <TableCell>{payment.paymentMethod || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.status === "approved"
                      ? "default"
                      : payment.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {payment.status === "approved"
                    ? "Aprobado"
                    : payment.status === "pending"
                      ? "Pendiente"
                      : "Rechazado"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(payment.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-muted-foreground text-sm">
        Mostrando {payments.length} de {total} pagos
      </p>
    </>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
