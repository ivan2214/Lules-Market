import Image from "next/image";
import Link from "next/link";
import { getCurrentYear } from "@/utils/date";

export async function PublicFooter() {
  const year = await getCurrentYear();

  return (
    <footer className="container mx-auto mt-auto border-t p-5 lg:p-10">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="flex flex-col items-start gap-2">
          <Link href="/">
            <div className="w-32">
              <Image
                src="/logo-tp.png"
                width={48}
                height={48}
                className="h-full w-full object-cover"
                alt="Logo Lules Market"
              />
            </div>
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
                href="/explorar/productos"
                className="text-muted-foreground hover:text-foreground"
              >
                Explorar
              </Link>
            </li>
            <li>
              <Link
                href="/explorar/comercios"
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
        <p>&copy; {year} Lules Market. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
