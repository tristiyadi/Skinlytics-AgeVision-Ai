/**
 * API Route: /api/health
 * Returns server status: DB connection + SD.Next availability.
 * Used by the network status hook to check connectivity.
 */
import { NextResponse } from "next/server";
import { checkHealth } from "@/lib/sdnext-client";
import { getDb } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const [sdnextOnline, dbOnline] = await Promise.all([
    checkHealth(),
    checkDb(),
  ]);

  return NextResponse.json({
    online: true,
    sdnext: sdnextOnline,
    database: dbOnline,
    timestamp: new Date().toISOString(),
  });
}

async function checkDb(): Promise<boolean> {
  try {
    const db = getDb();
    if (!db) return false;
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}
