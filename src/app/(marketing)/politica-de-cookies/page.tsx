import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Política de Cookies - Lules Market",
  description:
    "Explicación sobre el uso de cookies en Lules Market. Qué son, para qué las usamos y cómo gestionarlas.",
  keywords: "cookies, privacidad, rastreo, experiencia usuario, lules market",
};

export default function CookiesPage() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-y-16">
      <div>
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Política de Cookies
        </h1>
        <p className="text-lg text-muted-foreground">
          Esta política explica qué son las cookies, cómo las utilizamos en
          Lules Market y cómo usted puede gestionarlas.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. ¿Qué son las Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Las cookies son pequeños archivos de texto que los sitios web que
              visita guardan en su computadora o teléfono móvil. Permiten al
              sitio web recordar sus acciones y preferencias (como inicio de
              sesión, idioma, tamaño de letra y otras preferencias de
              visualización) durante un período de tiempo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. ¿Cómo utilizamos las Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Utilizamos cookies para las siguientes finalidades:</p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>
                <strong>Cookies Esenciales:</strong> Necesarias para el
                funcionamiento técnico de la web (ej. mantener su sesión activa
                mientras navega).
              </li>
              <li>
                <strong>Cookies de Preferencias:</strong> Nos permiten recordar
                sus ajustes y preferencias para mejorar su experiencia (ej. si
                prefiere el modo oscuro).
              </li>
              <li>
                <strong>Cookies de Análisis:</strong> (Google Analytics, Vercel
                Analytics) Nos ayudan a entender cómo interactúan los usuarios
                con la web, recopilando información de forma anónima para
                mejorar el rendimiento.
              </li>
              <li>
                <strong>Cookies de Publicidad:</strong> Podrían utilizarse para
                mostrar anuncios relevantes, aunque actualmente Lules Market no
                utiliza redes publicitarias externas invasivas.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Cookies de Terceros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              En algunos casos, utilizamos servicios de terceros de confianza
              que también pueden establecer cookies en su dispositivo:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>
                <strong>Google Analytics:</strong> Para medir estadísticas de
                visitas.
              </li>
              <li>
                <strong>Mercado Pago:</strong> Si realiza pagos o suscripciones,
                Mercado Pago puede usar cookies para procesar la transacción de
                forma segura.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. ¿Cómo controlar las Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Usted puede controlar y/o eliminar las cookies según desee. Puede
              eliminar todas las cookies que ya están en su computadora y puede
              configurar la mayoría de los navegadores para evitar que se
              coloquen.
            </p>
            <p>
              Sin embargo, si hace esto, es posible que tenga que ajustar
              manualmente algunas preferencias cada vez que visite un sitio y
              que algunos servicios y funcionalidades no funcionen (como el
              inicio de sesión automático).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Actualizaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Podemos actualizar esta Política de Cookies ocasionalmente para
              reflejar cambios en nuestras cookies o por razones operativas,
              legales o reglamentarias.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
