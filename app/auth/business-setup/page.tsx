import { getCategories } from "@/app/actions/public-actions";
import { requireBusiness } from "@/app/data/business/require-busines";
import { BusinessSetupForm } from "@/components/auth/business-setup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BusinessSetup() {
  await requireBusiness();

  const categories = await getCategories();
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
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
