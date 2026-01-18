import { Building2, Users } from "lucide-react";
import { Suspense } from "react";
import {
  getAdminBusinesses,
  getAdminEntities,
} from "@/data/admin/entities-admin";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { EntityActions } from "./_components/entity-actions";

export default function AdminEntitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Usuarios y Comercios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gestión combinada de usuarios y comercios de la plataforma.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="businesses" className="gap-2">
            <Building2 className="h-4 w-4" />
            Comercios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>
                Todos los usuarios registrados en la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-auto max-w-4xl overflow-x-auto">
              <Suspense fallback={<TableSkeleton />}>
                <UsersTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Comercios</CardTitle>
              <CardDescription>
                Todos los comercios registrados en la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-auto max-w-4xl overflow-x-auto">
              <Suspense fallback={<TableSkeleton />}>
                <BusinessesTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function UsersTable() {
  const { users, total } = await getAdminEntities({ page: 1, perPage: 50 });

  if (users.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay usuarios registrados.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Comercio</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="max-w-3xl overflow-x-auto">
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name || "Sin nombre"}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.business?.name || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <EntityActions type="user" entity={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-muted-foreground text-sm">
        Mostrando {users.length} de {total} usuarios
      </p>
    </>
  );
}

async function BusinessesTable() {
  const businesses = await getAdminBusinesses({ page: 1, perPage: 50 });

  if (businesses.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay comercios registrados.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Propietario</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Registro</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((business) => (
          <TableRow key={business.id}>
            <TableCell className="font-medium">{business.name}</TableCell>
            <TableCell>{business.user?.name || business.user?.email}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {business.currentPlan?.plan?.name || "Gratis"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  business.status === "ACTIVE"
                    ? "default"
                    : business.status === "SUSPENDED"
                      ? "destructive"
                      : "secondary"
                }
              >
                {business.status === "ACTIVE"
                  ? "Activo"
                  : business.status === "SUSPENDED"
                    ? "Suspendido"
                    : "Pendiente"}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(business.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <EntityActions type="business" entity={business} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
