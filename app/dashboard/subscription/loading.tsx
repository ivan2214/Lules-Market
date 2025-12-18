import { Card, CardContent, CardHeader } from "@/app/shared/components/ui/card";
import { Skeleton } from "@/app/shared/components/ui/skeleton";

export default function SubscriptionLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Suscripción</h1>
        <p className="text-muted-foreground">Gestiona tu plan y facturación</p>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i.toString()} className="h-96 w-full" />
        ))}
      </div>
    </div>
  );
}
