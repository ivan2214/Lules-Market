import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { env } from "@/env/server";
import * as schema from "./schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const dbNeon = drizzleNeon({ connection: env.DATABASE_URL, schema });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });
