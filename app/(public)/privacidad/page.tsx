import type { Metadata } from "next";
import { PublicFooter } from "@/components/public/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Política de Privacidad - Lules Market",
  description:
    "Conoce nuestra política de privacidad. Información sobre cómo recopilamos, usamos y protegemos tus datos personales.",
  keywords:
    "privacidad, datos personales, protección de datos, política, marketplace",
  openGraph: {
    title: "Política de Privacidad - Lules Market",
    description:
      "Conoce nuestra política de privacidad y cómo protegemos tus datos.",
    url: "https://lules-market.vercel.app/privacidad",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidad - Lules Market",
    description:
      "Conoce nuestra política de privacidad y cómo protegemos tus datos.",
  },
  alternates: {
    canonical: "https://lules-market.vercel.app/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Política de Privacidad
        </h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Información que Recopilamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Recopilamos diferentes tipos de información para proporcionar y
              mejorar nuestros servicios:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Información de Cuenta
                </h4>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Nombre y apellido</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Contraseña (encriptada)</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Información del Negocio
                </h4>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Nombre del negocio</li>
                  <li>Descripción y categoría</li>
                  <li>Dirección física</li>
                  <li>
                    Información de contacto (teléfono, email, redes sociales)
                  </li>
                  <li>Horarios de atención</li>
                  <li>Fotos y logotipos</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Información de Uso
                </h4>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Páginas visitadas y acciones realizadas</li>
                  <li>Dirección IP y tipo de navegador</li>
                  <li>Fecha y hora de acceso</li>
                  <li>Estadísticas de interacción con su perfil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Cómo Utilizamos su Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Utilizamos la información recopilada para:</p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Crear y gestionar su cuenta de usuario</li>
              <li>Mostrar su perfil de negocio a potenciales clientes</li>
              <li>Procesar pagos y gestionar suscripciones</li>
              <li>Enviar notificaciones importantes sobre su cuenta</li>
              <li>Proporcionar análisis y estadísticas sobre su negocio</li>
              <li>
                Mejorar nuestros servicios y desarrollar nuevas funcionalidades
              </li>
              <li>Detectar y prevenir fraudes o abusos</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Compartir Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              No vendemos su información personal a terceros. Podemos compartir
              su información en las siguientes circunstancias:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>
                <strong>Información Pública:</strong> La información de su
                perfil de negocio es pública y visible para todos los usuarios
                de la plataforma
              </li>
              <li>
                <strong>Proveedores de Servicios:</strong> Compartimos
                información con proveedores que nos ayudan a operar la
                plataforma (hosting, procesamiento de pagos, análisis)
              </li>
              <li>
                <strong>Requisitos Legales:</strong> Podemos divulgar
                información si es requerido por ley o para proteger nuestros
                derechos
              </li>
              <li>
                <strong>Transferencias Comerciales:</strong> En caso de fusión,
                adquisición o venta de activos, su información puede ser
                transferida
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Seguridad de los Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger su información:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Encriptación de contraseñas y datos sensibles</li>
              <li>Conexiones seguras HTTPS</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo regular de vulnerabilidades</li>
              <li>Copias de seguridad periódicas</li>
            </ul>
            <p>
              Sin embargo, ningún método de transmisión por Internet es 100%
              seguro. No podemos garantizar la seguridad absoluta de su
              información.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookies y Tecnologías Similares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Utilizamos cookies y tecnologías similares para:</p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Mantener su sesión activa</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Mejorar la experiencia del usuario</li>
            </ul>
            <p>
              Puede configurar su navegador para rechazar cookies, pero esto
              puede afectar la funcionalidad de la plataforma.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Sus Derechos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Usted tiene derecho a:</p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>
                <strong>Acceder:</strong> Solicitar una copia de su información
                personal
              </li>
              <li>
                <strong>Rectificar:</strong> Corregir información inexacta o
                incompleta
              </li>
              <li>
                <strong>Eliminar:</strong> Solicitar la eliminación de su cuenta
                y datos
              </li>
              <li>
                <strong>Portabilidad:</strong> Recibir sus datos en un formato
                estructurado
              </li>
              <li>
                <strong>Oposición:</strong> Oponerse al procesamiento de sus
                datos en ciertos casos
              </li>
              <li>
                <strong>Limitación:</strong> Solicitar la limitación del
                procesamiento de sus datos
              </li>
            </ul>
            <p>
              Para ejercer estos derechos, puede contactarnos a través de la
              configuración de su cuenta o enviando un email a
              privacidad@plataforma.com
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Retención de Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Conservamos su información personal mientras su cuenta esté activa
              o según sea necesario para proporcionar nuestros servicios.
            </p>
            <p>
              Cuando elimine su cuenta, eliminaremos o anonimizaremos su
              información personal, excepto cuando debamos conservarla por
              obligaciones legales o para resolver disputas.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Privacidad de Menores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nuestros servicios no están dirigidos a menores de 18 años. No
              recopilamos intencionalmente información personal de menores.
            </p>
            <p>
              Si descubrimos que hemos recopilado información de un menor,
              tomaremos medidas para eliminar esa información de nuestros
              sistemas.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Cambios a esta Política</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Podemos actualizar esta política de privacidad periódicamente. Le
              notificaremos sobre cambios significativos publicando la nueva
              política en esta página y actualizando la fecha de "última
              actualización".
            </p>
            <p>
              Le recomendamos revisar esta política periódicamente para estar
              informado sobre cómo protegemos su información.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Si tiene preguntas sobre esta política de privacidad o sobre cómo
              manejamos su información, puede contactarnos:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Email: privacidad@plataforma.com</li>
              <li>Formulario de contacto en nuestra página web</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
