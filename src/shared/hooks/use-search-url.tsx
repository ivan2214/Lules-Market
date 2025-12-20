import { useMemo } from "react";

export type TypeExplorer = "productos" | "comercios";

interface UseSearchUrlProps {
  currentParams?: Record<string, string | undefined>;
  typeExplorer: TypeExplorer;
}

export function useSearchUrl({
  currentParams = {},
  typeExplorer,
}: UseSearchUrlProps) {
  /**
   * Genera la URL combinando los parámetros actuales con nuevas actualizaciones
   */
  const createUrl = (updates: Record<string, string | undefined>) => {
    // Combina parámetros actuales con las actualizaciones
    const newParams: Record<string, string | undefined> = {
      ...currentParams,
      ...updates,
    };

    // Elimina claves undefined o vacías
    Object.keys(newParams).forEach((key) => {
      if (!newParams[key] || newParams[key] === "") {
        delete newParams[key];
      }
    });

    // Resetea la página si se cambió algún filtro que no sea page
    const hasFilterChanged = Object.keys(updates).some((k) => k !== "page");
    if (hasFilterChanged) {
      delete newParams.page;
    }

    // Construye query string
    const searchParams = new URLSearchParams(
      newParams as Record<string, string>,
    );
    const queryString = searchParams.toString();

    return `/explorar/${typeExplorer}${queryString ? `?${queryString}` : ""}`;
  };

  return useMemo(() => ({ createUrl }), [currentParams, typeExplorer]);
}
