"use client";

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Home,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"; // Importar useState
import { Button } from "@/app/shared/components/ui/button";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <needed>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false); // Estado para mostrar/ocultar detalles

  useEffect(() => {
    // Es mejor usar un sistema de log/reporte para errores en producción
    console.error(" Error:", error);
  }, [error]);

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    // Contenedor principal con centrado y fondo
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-900">
      {/* Tarjeta de error central */}
      <div className="w-full max-w-xl space-y-8 rounded-xl border border-red-200 bg-white p-8 shadow-2xl dark:border-red-700/50 dark:bg-gray-800">
        {/* Icono de error prominente */}
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="font-extrabold text-4xl text-gray-900 dark:text-white">
            ¡Oops! Algo salió muy mal
          </h1>
          <p className="text-center text-gray-600 text-lg dark:text-gray-400">
            Lo sentimos, un error inesperado ha impedido que la página se cargue
            correctamente.
          </p>
        </div>

        {/* --- */}

        {/* Controles de Acción (Botones) */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={reset} size="lg" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-5 w-5" />
            Intentar nuevamente
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Volver a la página principal
            </Link>
          </Button>
        </div>

        {/* --- */}

        {/* Sección de Detalles Técnicos */}
        <div className="space-y-4">
          <Button
            onClick={toggleDetails}
            variant="ghost"
            className="w-full justify-start text-red-600 text-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            {showDetails ? (
              <ChevronUp className="mr-2 h-4 w-4" />
            ) : (
              <ChevronDown className="mr-2 h-4 w-4" />
            )}
            {showDetails
              ? "Ocultar detalles técnicos"
              : "Mostrar detalles técnicos"}
          </Button>

          {/* Bloque de detalles condicional */}
          {showDetails && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
              {/* Usar pre/code para formato monospaced y mantener saltos de línea */}
              <code className="wrap-break-word block whitespace-pre-wrap font-mono text-gray-700 text-xs dark:text-gray-300">
                {error.digest && (
                  <p className="mb-1">
                    <strong className="text-red-600 dark:text-red-400">
                      ID de Error:
                    </strong>{" "}
                    {error.digest}
                  </p>
                )}
                {error.name && (
                  <p className="mb-1">
                    <strong className="text-red-600 dark:text-red-400">
                      Tipo de Error:
                    </strong>{" "}
                    {error.name}
                  </p>
                )}
                {error.message && (
                  <p className="mb-1">
                    <strong className="text-red-600 dark:text-red-400">
                      Mensaje:
                    </strong>{" "}
                    {error.message}
                  </p>
                )}
                {!!error.cause && (
                  <p className="mb-1">
                    <strong className="text-red-600 dark:text-red-400">
                      Causa:
                    </strong>{" "}
                    {String(error.cause)}
                  </p>
                )}
              </code>
              {/* Sugerencia de acción para desarrolladores */}
              <p className="mt-4 border-t pt-3 text-gray-500 text-xs dark:text-gray-400">
                Si eres desarrollador, usa estos detalles para diagnosticar el
                problema o inclúyelos en tu reporte.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
