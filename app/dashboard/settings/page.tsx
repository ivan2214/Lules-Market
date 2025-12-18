import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AccountSettingsForm } from "@/app/dashboard/_components/account-settings-form";
import { DangerZone } from "@/app/dashboard/_components/danger-zone";
import { getCurrentUser } from "@/app/data/user/require-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";

export default async function SettingsPage() {
  await connection();
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y preferencias
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>Actualiza tu información personal</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountSettingsForm user={user} />
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          <CardDescription>
            Acciones irreversibles relacionadas con tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DangerZone />
        </CardContent>
      </Card>
    </div>
  );
}
