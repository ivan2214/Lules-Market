import { getCategories } from "@/app/actions/public-actions";
import { getCurrentBusiness } from "@/app/data/business/require-busines";

import { BusinessProfileForm } from "@/components/dashboard/business-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BusinessPage() {
  const { currentBusiness } = await getCurrentBusiness();
  const categories = await getCategories();

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
