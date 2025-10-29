import { cacheLife } from "next/cache";
import prisma from "@/lib/prisma";
import { UsersClient } from "./components/users-client";

export default async function UsersPage() {
  "use cache";
  cacheLife("hours");
  const users = await prisma.user.findMany({
    include: {
      business: true,
      bannedUser: true,
      admin: true,
    },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground">
          Administra todos los usuarios de la plataforma
        </p>
      </div>

      <UsersClient users={users} />
    </div>
  );
}
