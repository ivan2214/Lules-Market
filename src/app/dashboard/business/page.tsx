import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { client } from "@/orpc";
import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business";
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
  const [error, result] = await getCurrentBusiness();

  if (error || !result.currentBusiness) {
    redirect(pathsConfig.auth.signUp);
  }
  const { currentBusiness } = result;
  const categories = await client.category.listAllCategories();

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
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
