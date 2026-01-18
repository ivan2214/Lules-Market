import type { Metadata } from "next";
import { env } from "@/env/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - Lules Market",
  description:
    "Resuelve tus dudas sobre Lules Market. Preguntas frecuentes para compradores y comercios.",
  keywords: "faq, preguntas frecuentes, ayuda, soporte, lules market",
  openGraph: {
    title: "Preguntas Frecuentes - Lules Market",
    description:
      "Resuelve tus dudas sobre Lules Market. Preguntas frecuentes para compradores y comercios.",
    url: `${env.APP_URL}/faq`,
    images: [
      {
        url: `${env.APP_URL}/logo.webp`,
        width: 512,
        height: 512,
        alt: "Lules Market Logo",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: `${env.APP_URL}/faq`,
  },
};

export default function FAQPage() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-y-16">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="text-lg text-muted-foreground">
          Encuentra respuestas rápidas a las consultas más comunes sobre el uso
          de nuestra plataforma.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-y-10">
        <section className="w-full">
          <h2 className="mb-4 font-semibold text-2xl">Para Compradores</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                ¿Necesito registrarme para ver productos?
              </AccordionTrigger>
              <AccordionContent>
                No, puedes explorar todos los comercios y productos de Lules
                Market sin necesidad de crear una cuenta. Solo necesitarás
                contactar al vendedor por sus medios externos (WhatsApp, etc.)
                para concretar la compra.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Cómo realizo una compra?</AccordionTrigger>
              <AccordionContent>
                Lules Market funciona como un catálogo digital centralizado.
                Cuando encuentres un producto que te guste, verás botones para
                "Llamar", "Enviar mensaje" o "WhatsApp". La transacción se
                acuerda directamente con el vendedor, sin intermediarios en el
                pago por ahora.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>¿Tienen envíos a domicilio?</AccordionTrigger>
              <AccordionContent>
                Cada comercio maneja su propia logística de envíos. Debes
                consultar con cada vendedor si ofrecen delivery en Lules o zonas
                aledañas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="w-full">
          <h2 className="mb-4 font-semibold text-2xl">Para Comercios</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="biz-1">
              <AccordionTrigger>
                ¿Cuánto cuesta publicar mi negocio?
              </AccordionTrigger>
              <AccordionContent>
                Tenemos un plan gratuito para comenzar y planes pagos con más
                beneficios y visibilidad. Puedes ver el detalle completo en
                nuestra sección de{" "}
                <a href="/planes" className="text-primary underline">
                  Planes
                </a>
                .
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="biz-2">
              <AccordionTrigger>
                ¿Cómo recibo los pagos de mis ventas?
              </AccordionTrigger>
              <AccordionContent>
                Actualmente, los clientes te contactan directamente y tú
                gestionas el cobro como prefieras (Efectivo, Transferencia, TU
                propio QR de Mercado Pago, etc.). Nosotros no retenemos
                comisiones por venta.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="biz-3">
              <AccordionTrigger>
                ¿Puedo dar de baja mi suscripción cuando quiera?
              </AccordionTrigger>
              <AccordionContent>
                Sí, absolutamente. No hay plazos forzosos. Puedes cancelar tu
                suscripción desde tu panel de control en cualquier momento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="w-full">
          <h2 className="mb-4 font-semibold text-2xl">Seguridad y Soporte</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sec-1">
              <AccordionTrigger>
                ¿Qué hago si tengo un problema con un comercio?
              </AccordionTrigger>
              <AccordionContent>
                Primero intenta resolverlo directamente con ellos. Si no
                obtienes respuesta o consideras que hubo fraude, contáctanos a
                soporte@lulesmarket.com.ar para que podamos investigar y tomar
                medidas sobre el perfil del comercio.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>

      <div className="text-center text-muted-foreground text-sm">
        <p>
          ¿No encontraste lo que buscabas? Escríbenos a{" "}
          <a
            href="mailto:soporte@lulesmarket.com.ar"
            className="text-primary hover:underline"
          >
            soporte@lulesmarket.com.ar
          </a>
        </p>
      </div>
    </section>
  );
}
