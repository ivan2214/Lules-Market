"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { api } from "@/lib/eden";

const STORAGE_KEY = "visited_products";
const EXPIRY_DAYS = 30; // 1 mes

type VisitRecord = {
  [productId: string]: number; // timestamp en milisegundos
};

export function ProductViewTracker({ productId }: { productId: string }) {
  const { mutate } = useMutation({
    mutationKey: ["product-view", productId],
    mutationFn: async (productId: string) =>
      api.products.public.trackView({
        productId,
      }),
  });

  const hasExecuted = useRef(false);

  useEffect(() => {
    // Evitar doble ejecución en desarrollo (React StrictMode)
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    // Limpiar visitas expiradas antes de verificar
    cleanExpiredVisits();

    // Verificar si el usuario ya visitó este producto en el último mes
    const hasVisited = checkIfVisited(productId);

    if (!hasVisited) {
      // Registrar la visita en el backend
      mutate(productId, {
        onSuccess: () => {
          // Solo marcar como visitado si el registro fue exitoso
          markAsVisited(productId);
        },
      });
    }
  }, [productId, mutate]);

  return null;
}

// Función para verificar si ya visitó este producto en el último mes
function checkIfVisited(productId: string): boolean {
  try {
    const visited = localStorage.getItem(STORAGE_KEY);
    if (!visited) return false;

    const visitRecord: VisitRecord = JSON.parse(visited);
    const lastVisit = visitRecord[productId];

    if (!lastVisit) return false;

    // Verificar si ha pasado el tiempo de expiración (30 días)
    const now = Date.now();
    const daysSinceVisit = (now - lastVisit) / (1000 * 60 * 60 * 24);

    return daysSinceVisit < EXPIRY_DAYS;
  } catch (error) {
    console.error("Error checking visited products:", error);
    return false;
  }
}

// Función para marcar como visitado
function markAsVisited(productId: string): void {
  try {
    const visited = localStorage.getItem(STORAGE_KEY);
    const visitRecord: VisitRecord = visited ? JSON.parse(visited) : {};

    // Guardar timestamp actual
    visitRecord[productId] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitRecord));
  } catch (error) {
    console.error("Error marking product as visited:", error);
  }
}

// Función para limpiar visitas expiradas (optimización de storage)
function cleanExpiredVisits(): void {
  try {
    const visited = localStorage.getItem(STORAGE_KEY);
    if (!visited) return;

    const visitRecord: VisitRecord = JSON.parse(visited);
    const now = Date.now();
    const cleanedRecord: VisitRecord = {};

    // Mantener solo las visitas que no han expirado
    Object.entries(visitRecord).forEach(([productId, timestamp]) => {
      const daysSinceVisit = (now - timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceVisit < EXPIRY_DAYS) {
        cleanedRecord[productId] = timestamp;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedRecord));
  } catch (error) {
    console.error("Error cleaning expired visits:", error);
  }
}
