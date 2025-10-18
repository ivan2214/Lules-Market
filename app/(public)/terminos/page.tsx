import type { Metadata } from "next";
import { PublicFooter } from "@/components/public/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Lules Market",
  description:
    "Conoce nuestros términos y condiciones de uso. Información legal importante sobre el uso de nuestra plataforma.",
  keywords: "términos, condiciones, legal, normativa, marketplace",
  openGraph: {
    title: "Términos y Condiciones - Lules Market",
    description: "Conoce nuestros términos y condiciones de uso.",
    url: "https://lules-market.vercel.app/terminos",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Términos y Condiciones - Lules Market",
    description: "Conoce nuestros términos y condiciones de uso.",
  },
  alternates: {
    canonical: "https://lules-market.vercel.app/terminos",
  },
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Términos y Condiciones
        </h1>
        <p className="text-muted-foreground">
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Aceptación de los Términos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Al acceder y utilizar esta plataforma, usted acepta estar sujeto a
              estos términos y condiciones de uso. Si no está de acuerdo con
              alguna parte de estos términos, no debe utilizar nuestros
              servicios.
            </p>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Es su responsabilidad revisar periódicamente estos
              términos para estar al tanto de cualquier cambio.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Uso de la Plataforma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Esta plataforma está diseñada para ayudar a negocios locales a
              establecer su presencia digital. Al utilizar nuestros servicios,
              usted se compromete a:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>
                Proporcionar información veraz y actualizada sobre su negocio
              </li>
              <li>
                No utilizar la plataforma para actividades ilegales o
                fraudulentas
              </li>
              <li>
                No infringir los derechos de propiedad intelectual de terceros
              </li>
              <li>
                Mantener la confidencialidad de sus credenciales de acceso
              </li>
              <li>No intentar acceder a áreas restringidas del sistema</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Cuentas de Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Para utilizar ciertas funciones de la plataforma, debe crear una
              cuenta. Usted es responsable de:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Mantener la seguridad de su contraseña</li>
              <li>Todas las actividades que ocurran bajo su cuenta</li>
              <li>
                Notificarnos inmediatamente sobre cualquier uso no autorizado
              </li>
            </ul>
            <p>
              Nos reservamos el derecho de suspender o cancelar cuentas que
              violen estos términos o que permanezcan inactivas por períodos
              prolongados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Contenido del Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Usted conserva todos los derechos sobre el contenido que publique
              en la plataforma (fotos, descripciones, productos, etc.). Sin
              embargo, al publicar contenido, nos otorga una licencia no
              exclusiva para usar, mostrar y distribuir ese contenido en
              relación con nuestros servicios.
            </p>
            <p>
              Usted garantiza que tiene todos los derechos necesarios sobre el
              contenido que publica y que dicho contenido no infringe los
              derechos de terceros.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Planes y Pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Ofrecemos diferentes planes de suscripción con distintas
              funcionalidades. Los pagos se procesan de forma segura a través de
              MercadoPago.
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Los planes se facturan mensualmente por adelantado</li>
              <li>Puede cancelar su suscripción en cualquier momento</li>
              <li>No se realizan reembolsos por períodos parciales</li>
              <li>Los precios pueden cambiar con previo aviso</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Limitación de Responsabilidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              La plataforma se proporciona "tal cual" sin garantías de ningún
              tipo. No garantizamos que el servicio será ininterrumpido o libre
              de errores.
            </p>
            <p>
              No seremos responsables por daños indirectos, incidentales o
              consecuentes que resulten del uso o la imposibilidad de usar
              nuestros servicios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Propiedad Intelectual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Todos los derechos de propiedad intelectual sobre la plataforma,
              incluyendo el diseño, código, logotipos y marcas, son propiedad
              nuestra o de nuestros licenciantes.
            </p>
            <p>
              No se le otorga ningún derecho sobre nuestra propiedad intelectual
              excepto el derecho limitado de usar la plataforma según estos
              términos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Terminación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Podemos suspender o terminar su acceso a la plataforma en
              cualquier momento, sin previo aviso, por cualquier motivo,
              incluyendo la violación de estos términos.
            </p>
            <p>
              Usted puede cancelar su cuenta en cualquier momento desde la
              configuración de su perfil.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Ley Aplicable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Estos términos se rigen por las leyes de Argentina. Cualquier
              disputa relacionada con estos términos estará sujeta a la
              jurisdicción exclusiva de los tribunales de Argentina.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Si tiene preguntas sobre estos términos y condiciones, puede
              contactarnos a través de:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Email: soporte@plataforma.com</li>
              <li>Formulario de contacto en nuestra página web</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
