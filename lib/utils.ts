import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Crea una URL con los parámetros de búsqueda actualizados
 * @param currentParams Parámetros actuales
 * @param updates Actualizaciones a aplicar
 * @returns URL con parámetros actualizados
 */
export function createSearchUrl(
  currentParams: Record<string, string | undefined>,
  updates: Record<string, string | undefined>
): string {
  // Crear una copia de los parámetros actuales
  const newParams = { ...currentParams };

  // Aplicar actualizaciones
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      // Si el valor es undefined o vacío, eliminar el parámetro
      delete newParams[key];
    } else {
      // De lo contrario, actualizar el valor
      newParams[key] = value;
    }
  });

  // Resetear la página si cambian los filtros (excepto si estamos actualizando la página)
  if (!updates.page && newParams.page) {
    delete newParams.page;
  }

  // Construir la URL
  const searchParams = new URLSearchParams();
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) searchParams.append(key, value);
  });

  return `/explorar${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;
}
