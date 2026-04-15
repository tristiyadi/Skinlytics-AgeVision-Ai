"use server";

import { db } from "@/db";
import { scans, results } from "@/db/schema";

export async function saveAnalysis(data: {
  age: number;
  gender: string;
  wrinkles: {
    score: number;
    level: string;
  };
}) {
  try {
    // 1. Create a scan record
    const [scan] = await db.insert(scans).values({}).returning();

    // 2. Create the result record
    await db.insert(results).values({
      scanId: scan.id,
      estimatedAge: Math.round(data.age),
      wrinkleScore: data.wrinkles.score,
      wrinkleLevel: data.wrinkles.level,
    });

    return { success: true, scanId: scan.id };
  } catch (error) {
    console.error("Failed to save analysis:", error);
    return { success: false, error: "Database error" };
  }
}
