"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { api } from "@/lib/eden";

const STORAGE_KEY = "visited_businesses";
const EXPIRY_DAYS = 30; // 1 mes = 30 días

type VisitRecord = {
  [businessId: string]: number; // timestamp en milisegundos
};

export function BusinessViewTracker({ businessId }: { businessId: string }) {
  const { mutate } = useMutation({
    mutationKey: ["business-view", businessId],
    mutationFn: async (businessId: string) =>
      api.business.public.trackView({
        businessId,
      }),
  });

  const hasExecuted = useRef(false);

  useEffect(() => {
    // Evitar doble ejecución en desarrollo (React StrictMode)
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    // Limpiar visitas expiradas antes de verificar
    cleanExpiredVisits();

    // Verificar si el usuario ya visitó este comercio en el último mes
    const hasVisited = checkIfVisited(businessId);

    if (!hasVisited) {
      // Registrar la visita en el backend
      mutate(businessId, {
        onSuccess: () => {
          // Solo marcar como visitado si el registro fue exitoso
          markAsVisited(businessId);
        },
      });
    }
  }, [businessId, mutate]);

  return null;
}

// Función para verificar si ya visitó este comercio en el último mes
function checkIfVisited(businessId: string): boolean {
  try {
    const visited = localStorage.getItem(STORAGE_KEY);
    if (!visited) return false;

    const visitRecord: VisitRecord = JSON.parse(visited);
    const lastVisit = visitRecord[businessId];

    if (!lastVisit) return false;

    // Verificar si ha pasado el tiempo de expiración (30 días)
    const now = Date.now();
    const daysSinceVisit = (now - lastVisit) / (1000 * 60 * 60 * 24);

    return daysSinceVisit < EXPIRY_DAYS;
  } catch (error) {
    console.error("Error checking visited businesses:", error);
    return false;
  }
}

// Función para marcar como visitado
function markAsVisited(businessId: string): void {
  try {
    const visited = localStorage.getItem(STORAGE_KEY);
    const visitRecord: VisitRecord = visited ? JSON.parse(visited) : {};

    // Guardar timestamp actual
    visitRecord[businessId] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitRecord));
  } catch (error) {
    console.error("Error marking business as visited:", error);
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
    Object.entries(visitRecord).forEach(([businessId, timestamp]) => {
      const daysSinceVisit = (now - timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceVisit < EXPIRY_DAYS) {
        cleanedRecord[businessId] = timestamp;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedRecord));
  } catch (error) {
    console.error("Error cleaning expired visits:", error);
  }
}
