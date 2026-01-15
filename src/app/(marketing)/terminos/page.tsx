import type { Metadata } from "next";
import { env } from "@/env/server";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Lules Market",
  description:
    "Términos y condiciones de uso de Lules Market. Marco legal, derechos y obligaciones para usuarios y comercios en Argentina.",
  keywords: "términos, condiciones, legal, argentina, tucumán, lules market",
  openGraph: {
    title: "Términos y Condiciones - Lules Market",
    description: "Conoce nuestros términos y condiciones de uso.",
    url: `${env.APP_URL}/terminos`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Términos y Condiciones - Lules Market",
    description: "Conoce nuestros términos y condiciones de uso.",
  },
  alternates: {
    canonical: `${env.APP_URL}/terminos`,
  },
};

export default function TerminosPage() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-y-16">
      <div className="">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Última actualización: Diciembre 2025
          </Badge>
        </div>
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Términos y Condiciones
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido a Lules Market. Por favor, lea atentamente estos términos
          antes de utilizar nuestra plataforma.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-4 font-semibold text-lg">Resumen Rápido</h2>
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          <li>
            ✅ <strong>Somos intermediarios:</strong> Conectamos compradores y
            vendedores.
          </li>
          <li>
            ✅ <strong>Responsabilidad:</strong> Cada comercio es responsable de
            sus productos.
          </li>
          <li>
            ✅ <strong>Pagos:</strong> Las transacciones se acuerdan entre
            partes (por ahora).
          </li>
          <li>
            ✅ <strong>Jurisdicción:</strong> San Miguel de Tucumán, Argentina.
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Aceptación de los Términos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Al acceder y utilizar Lules Market, usted acepta estar sujeto a
              estos términos y condiciones, así como a nuestra Política de
              Privacidad y demás políticas complementarias. Si no está de
              acuerdo, debe abstenerse de utilizar el sitio.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Descripción del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Lules Market es una plataforma digital que permite a comercios
              locales de Lules, Tucumán, exhibir sus productos y servicios, y a
              los usuarios contactarlos para realizar compras.
            </p>
            <p>
              <strong>Importante:</strong> Lules Market no es el propietario de
              los productos ofrecidos, no tiene posesión de ellos ni interviene
              en el perfeccionamiento de las operaciones entre usuarios y
              comercios, salvo disposición expresa en contrario.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Obligaciones de los Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Proporcionar información veraz y mantenerla actualizada.</li>
              <li>
                No utilizar la plataforma con fines ilícitos o que perjudiquen a
                terceros.
              </li>
              <li>Mantener la confidencialidad de su cuenta y contraseña.</li>
              <li>Comportarse con respeto hacia otros usuarios y comercios.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Propiedad Intelectual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Los contenidos de las pantallas relativas a los servicios de Lules
              Market, así como los programas, bases de datos, redes y archivos
              son de propiedad de Lules Market y están protegidos por las leyes
              y tratados internacionales de derecho de autor, marcas, patentes,
              modelos y diseños industriales.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Limitación de Responsabilidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Lules Market pone a disposición un espacio virtual. No
              garantizamos la veracidad de la publicidad de terceros que
              aparezca en el sitio y no seremos responsables por la
              correspondencia o contratos que el usuario celebre con dichos
              terceros o con otros usuarios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Ley Aplicable y Jurisdicción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la
              República Argentina.
            </p>
            <p>
              Cualquier controversia derivada del presente acuerdo, su
              existencia, validez, interpretación, alcance o cumplimiento, será
              sometida a los{" "}
              <strong>
                Tribunales Ordinarios de la Ciudad de San Miguel de Tucumán
              </strong>
              , renunciando a cualquier otro fuero o jurisdicción.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Si tiene alguna duda sobre los Términos y Condiciones Generales o
              demás políticas y principios que rigen Lules Market, contáctenos
              en:
            </p>
            <p className="font-semibold text-primary">
              legales@lulesmarket.com.ar
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
