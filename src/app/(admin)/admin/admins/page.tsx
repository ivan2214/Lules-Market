import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";
import { AdminColumns } from "./_components/admin-columns";
import { AdminCreateDialog } from "./_components/admin-create-dialog";

/* TODO: MOVER A CACHE-FUNCTIONS Y A ORPC */
async function getAdmins() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ADMIN.ADMINS.GET_ALL);
  const admins = await db.query.admin.findMany({
    with: {
      user: {
        with: {
          admin: true,
          business: true,
        },
      },
    },
  });
  return { admins };
}

export default async function AdminsPage() {
  const { admins } = await getAdmins();

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-y-2 lg:flex-row lg:items-center lg:justify-between">
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
              {admins.filter((a) => a.permissions?.includes("ALL")).length}
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
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
          <AdminColumns admins={admins} />
        </CardContent>
      </Card>
    </div>
  );
}
