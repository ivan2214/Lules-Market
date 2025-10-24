import { Store } from "lucide-react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="container mx-auto mt-auto border-t bg-muted/40 p-5 lg:p-10">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Store className="h-6 w-6" />
            <span>Comercios Locales</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Tu vitrina digital para conectar con clientes locales
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Plataforma</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/explorar"
                className="text-muted-foreground hover:text-foreground"
              >
                Explorar
              </Link>
            </li>
            <li>
              <Link
                href="/planes"
                className="text-muted-foreground hover:text-foreground"
              >
                Planes y Precios
              </Link>
            </li>
            <li>
              <Link
                href="/como-funciona"
                className="text-muted-foreground hover:text-foreground"
              >
                Cómo Funciona
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Comercios</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/auth/signup"
                className="text-muted-foreground hover:text-foreground"
              >
                Registrar Negocio
              </Link>
            </li>
            <li>
              <Link
                href="/auth/signin"
                className="text-muted-foreground hover:text-foreground"
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Panel de Control
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/terminos"
                className="text-muted-foreground hover:text-foreground"
              >
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
                className="text-muted-foreground hover:text-foreground"
              >
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t pt-8 text-center text-muted-foreground text-sm">
        <p>
          &copy; {new Date().getFullYear()} Comercios Locales. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
