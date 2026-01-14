import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentBusiness } from "@/data/business/get-current-business";
import { api } from "@/lib/eden";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { BusinessProfileForm } from "./_components/business-profile-form";
import { ShareLinkCard } from "./_components/share-link-card";

export default async function BusinessPage() {
  const { currentBusiness } = await getCurrentBusiness();

  if (!currentBusiness) {
    redirect(pathsConfig.business.setup);
  }
  const { data: categories } = await api.category.public["list-all"].get();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Perfil del Negocio
        </h1>
        <p className="text-muted-foreground">
          Administra la información pública de tu negocio
        </p>
      </div>

      <ShareLinkCard businessId={currentBusiness.id} />

      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
          <CardDescription>
            Esta información será visible para todos los usuarios que visiten tu
            perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessProfileForm
            business={currentBusiness}
            categories={categories || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
