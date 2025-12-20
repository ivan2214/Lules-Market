import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { env } from "@/env";
import * as schema from "./schema";

// ===============================================================
// DATABASE CONNECTION
// ===============================================================

/**
 * Instancia de Drizzle ORM configurada con el schema completo.
 * Usar para queries directas o en repositorios personalizados.
 */
export const db = drizzleNeon({ connection: env.DATABASE_URL, schema });

// ===============================================================
// RE-EXPORTS
// ===============================================================

/**
 * Re-export del schema completo
 */
export * as schema from "./schema";
