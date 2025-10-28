import { Suspense } from "react";
import { getMyBusiness } from "@/app/data/business/business.dal";
import { BusinessProfileForm } from "@/components/dashboard/business-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function BusinessContent() {
  const business = await getMyBusiness();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Negocio</CardTitle>
        <CardDescription>
          Esta información será visible para todos los usuarios que visiten tu
          perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BusinessProfileForm business={business} />
      </CardContent>
    </Card>
  );
}

function BusinessSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  );
}

export default function BusinessPage() {
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

      <Suspense fallback={<BusinessSkeleton />}>
        <BusinessContent />
      </Suspense>
    </div>
  );
}
