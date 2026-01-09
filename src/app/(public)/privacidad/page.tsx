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
  title: "Política de Privacidad - Lules Market",
  description:
    "Política de Privacidad de Lules Market. Protección de datos personales conforme a la Ley 25.326 de Argentina.",
  keywords:
    "privacidad, datos personales, protección datos, ley 25326, argentina",
  openGraph: {
    title: "Política de Privacidad - Lules Market",
    description: "Cómo protegemos tus datos personales.",
    url: `${env.APP_URL}/privacidad`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidad - Lules Market",
    description: "Cómo protegemos tus datos personales.",
  },
  alternates: {
    canonical: `${env.APP_URL}/privacidad`,
  },
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Ley 25.326 (Habeas Data)
          </Badge>
        </div>
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Política de Privacidad
        </h1>
        <p className="text-lg text-muted-foreground">
          Su privacidad es importante para nosotros. Esta política describe cómo
          Lules Market recopila, usa y protege su información personal.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Cumplimiento Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Lules Market cumple estrictamente con la{" "}
              <strong>Ley de Protección de Datos Personales No 25.326</strong>{" "}
              de la República Argentina.
            </p>
            <p>
              El titular de los datos personales tiene la facultad de ejercer el
              derecho de acceso a los mismos en forma gratuita a intervalos no
              inferiores a seis meses, salvo que se acredite un interés legítimo
              al efecto conforme lo establecido en el artículo 14, inciso 3 de
              la Ley No 25.326.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Información que Recopilamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Recopilamos información para brindar y mejorar nuestros servicios:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Datos de Registro
                </h4>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Nombre completo</li>
                  <li>Email</li>
                  <li>Contraseña (encriptada)</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Datos del Comercio (si aplica)
                </h4>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Nombre del negocio, CUIT y dirección</li>
                  <li>Teléfonos de contacto y redes sociales</li>
                  <li>Material multimedia (fotos, logos)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Finalidad del Tratamiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Utilizamos sus datos para:</p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Gestionar su cuenta y perfil en la plataforma.</li>
              <li>Facilitar la conexión entre compradores y vendedores.</li>
              <li>
                Enviar notificaciones importantes (cambios en el servicio,
                alertas de seguridad).
              </li>
              <li>
                Analizar métricas de uso para optimizar la experiencia (datos
                anonimizados).
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Transferencia Internacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Sus datos pueden ser almacenados en servidores ubicados fuera de
              Argentina (ej. proveedores de hosting en la nube como Vercel o
              Supabase). Lules Market se asegura de que dichos proveedores
              cumplan con estándares adecuados de seguridad y protección de
              datos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              evitar la pérdida, mal uso, alteración, acceso no autorizado y
              robo de los datos personales facilitados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Derechos del Titular (ARCO)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Como titular de los datos, usted tiene derecho a:</p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>
                <strong>Acceso:</strong> Saber qué datos tenemos de usted.
              </li>
              <li>
                <strong>Rectificación:</strong> Corregir datos erróneos.
              </li>
              <li>
                <strong>Actualización:</strong> Mantener sus datos al día.
              </li>
              <li>
                <strong>Supresión:</strong> Solicitar la eliminación de sus
                datos (Derecho al Olvido).
              </li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctenos en{" "}
              <strong>privacidad@lulesmarket.com.ar</strong>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Autoridad de Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              La <strong>Agencia de Acceso a la Información Pública</strong>, en
              su carácter de Órgano de Control de la Ley No 25.326, tiene la
              atribución de atender las denuncias y reclamos que interpongan
              quienes resulten afectados en sus derechos por incumplimiento de
              las normas vigentes en materia de protección de datos personales.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Utilizamos cookies para mejorar su experiencia. Para más
              información, consulte nuestra{" "}
              <a
                href="/politica-de-cookies"
                className="text-primary hover:underline"
              >
                Política de Cookies
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
