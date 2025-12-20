import { connection } from "next/server";

import { orpc } from "@/lib/orpc";
import { requireUser } from "@/shared/actions/user/require.user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { BusinessSetupForm } from "./_components/business-setup-form";

export default async function BusinessSetup() {
  await connection();
  await requireUser();
  const categories = await orpc.category.listAllCategories();
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Configura tu Negocio</CardTitle>
          <CardDescription>
            Completa la información de tu negocio para comenzar a publicar
            productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessSetupForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
