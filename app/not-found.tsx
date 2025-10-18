import { Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-bold text-9xl text-primary">404</h1>
          <h2 className="font-semibold text-3xl text-foreground">
            Página no encontrada
          </h2>
          <p className="text-lg text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/explorar">
              <Search className="mr-2 h-5 w-5" />
              Explorar productos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
