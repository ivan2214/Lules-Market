import pathsConfig from "@/config/paths.config";
import { client } from "@/orpc";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { BusinessSetupFormTwo } from "./_components/form";

async function BusinessSetup() {
  const categories = await client.category.listAllCategories();
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
          <BusinessSetupFormTwo categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
export default withAuthenticate(BusinessSetup, {
  role: "user",
  redirect: pathsConfig.auth.setup,
});
