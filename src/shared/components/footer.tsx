import Image from "next/image";
import Link from "next/link";
import { footerNavigation } from "@/shared/constants/footer-navigation";
import { getCurrentYear } from "@/shared/utils/date";

export async function Footer() {
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

        {Object.entries(footerNavigation).map(([key, value]) => (
          <div key={key}>
            <h3 className="mb-4 font-semibold">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <ul className="space-y-2 text-sm">
              {value.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-8 text-center text-muted-foreground text-sm">
        <p>&copy; {year} Lules Market. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
