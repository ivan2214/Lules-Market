import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { requireSession } from "@/orpc/actions/user/require-session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AccountSettingsForm } from "./_components/account-settings-form";
import { DangerZone } from "./_components/danger-zone";

export default async function SettingsPage() {
  const [error, session] = await requireSession();

  if (error) {
    redirect(pathsConfig.auth.signIn);
  }

  const { user } = session;

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
