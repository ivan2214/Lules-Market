import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AuthHeader } from "../_components/auth-header";

export default function Loading() {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <AuthHeader
        title="Restablecer Contraseña"
        subtitle="Ingresá tu nueva contraseña segura"
      />

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Restablecer Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />

          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="font-medium text-primary text-sm hover:text-primary/50"
            >
              Volver al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
