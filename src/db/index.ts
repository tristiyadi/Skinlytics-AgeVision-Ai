/**
 * Database Connection — Skinlytics AgeVision AI
 * Uses Neon (serverless Postgres) via Drizzle ORM.
 * Returns null if DATABASE_URL is not configured (allows offline-first operation).
 */
import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> | null {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[DB] DATABASE_URL not set — database features disabled (offline mode).");
    return null;
  }

  try {
    const sql = neon(url);
    _db = drizzle(sql, { schema });
    return _db;
  } catch (error) {
    console.error("[DB] Failed to initialize database:", error);
    return null;
  }
}

// Convenience export — backward compatible, but may be null
export const db = getDb();
