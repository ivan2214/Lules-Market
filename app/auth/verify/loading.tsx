import { AuthHeader } from "@/components/auth/auth-header";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="w-full max-w-md">
      <AuthHeader
        title="Verificación de Email"
        subtitle="Completá los siguientes pasos para registrar tu comercio"
      />

      <Card>
        <CardContent className="space-y-6 p-8 text-center">
          <Spinner />
        </CardContent>
      </Card>
    </div>
  );
}
