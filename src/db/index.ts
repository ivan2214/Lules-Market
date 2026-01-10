import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env/server";
import * as schema from "./schema";
import "dotenv/config";

export const dbNeon = drizzle({ connection: env.DATABASE_URL, schema });

export const db = dbNeon;
