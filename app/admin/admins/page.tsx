import { cacheLife } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { AdminColumns } from "./components/admin-columns";
import { AdminCreateDialog } from "./components/admin-create-dialog";

async function getAdmins() {
  const admins = await prisma.admin.findMany({
    include: {
      user: {
        include: {
          admin: true,
          business: true,
        },
      },
    },
  });
  return { admins };
}

export default async function AdminsPage() {
  "use cache";
  cacheLife("hours");
  const { admins } = await getAdmins();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Administradores
          </h1>
          <p className="text-muted-foreground">
            Administra los permisos de los administradores del sistema
          </p>
        </div>
        <AdminCreateDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{admins.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Con Permisos Completos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {admins.filter((a) => a.permissions.includes("ALL")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Administradores</CardTitle>
          <CardDescription>
            {admins.length} administradores registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminColumns admins={admins} />
        </CardContent>
      </Card>
    </div>
  );
}
