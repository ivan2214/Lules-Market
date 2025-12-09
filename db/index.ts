/**
 * ===============================================================
 * DATABASE - DRIZZLE ORM
 * ===============================================================
 *
 * Configuración central de la base de datos con Drizzle ORM.
 * Este archivo exporta la conexión a la base de datos y re-exporta
 * tipos, repositorios y servicios para acceso centralizado.
 *
 * USO:
 *
 * ```typescript
 * // Importar la conexión directamente
 * import { db } from "@/db";
 *
 * // Importar tipos
 * import type { Product, ProductWithRelations } from "@/db/types";
 *
 * // Importar repositorios
 * import { ProductRepository, BusinessRepository } from "@/db/repositories";
 *
 * // Importar servicios (recomendado para Server Components)
 * import { ProductService, BusinessService } from "@/db/services";
 * ```
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";
import * as schema from "./schema";

// ===============================================================
// DATABASE CONNECTION
// ===============================================================

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Instancia de Drizzle ORM configurada con el schema completo.
 * Usar para queries directas o en repositorios personalizados.
 */
export const db = drizzle({ client: pool, schema });

// ===============================================================
// RE-EXPORTS
// ===============================================================

/**
 * Re-export del schema completo
 */
export * as schema from "./schema";

/**
 * Re-export de todos los tipos
 */
export * from "./types";
