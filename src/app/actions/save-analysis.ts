/**
 * Server Action: saveAnalysis
 * 
 * Saves a face analysis result to the database.
 * This is a server action that can be called from client components.
 * Uses the new visitor-based schema (no login required).
 */
"use server";

import { getDb } from "@/db";
import { visitors, scans } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function saveAnalysis(data: {
  visitorId: string;
  age: number;
  gender: string;
  wrinkles: {
    score: number;
    level: string;
  };
}) {
  try {
    const db = getDb();
    if (!db) {
      return { success: false, error: "Database not configured" };
    }

    // Compute derived metrics
    const skinClarity = 100 - data.wrinkles.score;
    const hydrationEstimate = Math.max(30, 95 - data.wrinkles.score * 0.6);
    const elasticityEstimate = Math.max(25, 90 - data.wrinkles.score * 0.7);
    const uvDamageEstimate = Math.min(80, data.wrinkles.score * 0.8);
    const overallHealth = Math.round(
      (skinClarity + hydrationEstimate + elasticityEstimate + (100 - uvDamageEstimate)) / 4,
    );

    // Upsert visitor
    await db
      .insert(visitors)
      .values({
        id: data.visitorId,
        totalScans: 1,
      })
      .onConflictDoUpdate({
        target: visitors.id,
        set: {
          lastSeenAt: new Date(),
          totalScans: sql`${visitors.totalScans} + 1`,
        },
      });

    // Insert scan
    const [scan] = await db
      .insert(scans)
      .values({
        visitorId: data.visitorId,
        estimatedAge: Math.round(data.age),
        wrinkleScore: data.wrinkles.score,
        wrinkleLevel: data.wrinkles.level,
        gender: data.gender,
        skinClarity,
        hydrationEstimate,
        elasticityEstimate,
        uvDamageEstimate,
        overallHealth,
        source: "client",
      })
      .returning();

    return { success: true, scanId: scan.id };
  } catch (error) {
    console.error("Failed to save analysis:", error);
    return { success: false, error: "Database error" };
  }
}
