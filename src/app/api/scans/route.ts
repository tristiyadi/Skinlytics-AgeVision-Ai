/**
 * API Route: /api/scans
 * 
 * POST — Save a new scan result to the database
 * GET  — Retrieve scan history for a visitor
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { visitors, scans } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

/**
 * POST /api/scans — Save a scan result
 */
export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured", saved: false },
        { status: 503 },
      );
    }

    const body = await req.json();
    const {
      visitorId,
      estimatedAge,
      wrinkleScore,
      wrinkleLevel,
      gender,
      source = "client",
    } = body;

    if (!visitorId || !estimatedAge || wrinkleScore === undefined || !wrinkleLevel || !gender) {
      return NextResponse.json(
        { error: "Missing required fields: visitorId, estimatedAge, wrinkleScore, wrinkleLevel, gender" },
        { status: 400 },
      );
    }

    // Compute derived metrics
    const skinClarity = 100 - wrinkleScore;
    const hydrationEstimate = Math.max(30, 95 - wrinkleScore * 0.6);
    const elasticityEstimate = Math.max(25, 90 - wrinkleScore * 0.7);
    const uvDamageEstimate = Math.min(80, wrinkleScore * 0.8);
    const overallHealth = Math.round(
      (skinClarity + hydrationEstimate + elasticityEstimate + (100 - uvDamageEstimate)) / 4,
    );

    // Upsert visitor (create on first scan, update lastSeenAt on subsequent)
    const userAgent = req.headers.get("user-agent") || undefined;

    await db
      .insert(visitors)
      .values({
        id: visitorId,
        userAgent,
        totalScans: 1,
      })
      .onConflictDoUpdate({
        target: visitors.id,
        set: {
          lastSeenAt: new Date(),
          totalScans: sql`${visitors.totalScans} + 1`,
        },
      });

    // Insert scan record
    const [scan] = await db
      .insert(scans)
      .values({
        visitorId,
        estimatedAge,
        wrinkleScore,
        wrinkleLevel,
        gender,
        skinClarity,
        hydrationEstimate,
        elasticityEstimate,
        uvDamageEstimate,
        overallHealth,
        source,
        deviceInfo: userAgent ? { userAgent } : undefined,
      })
      .returning();

    return NextResponse.json({ saved: true, scan });
  } catch (error: unknown) {
    console.error("[API] Save scan error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, saved: false }, { status: 500 });
  }
}

/**
 * GET /api/scans?visitorId=xxx&limit=20 — Get scan history
 */
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured", scans: [] },
        { status: 503 },
      );
    }

    const { searchParams } = new URL(req.url);
    const visitorId = searchParams.get("visitorId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    if (!visitorId) {
      return NextResponse.json(
        { error: "visitorId query parameter is required" },
        { status: 400 },
      );
    }

    const scanHistory = await db
      .select()
      .from(scans)
      .where(eq(scans.visitorId, visitorId))
      .orderBy(desc(scans.createdAt))
      .limit(limit);

    return NextResponse.json({ scans: scanHistory });
  } catch (error: unknown) {
    console.error("[API] Get scans error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, scans: [] }, { status: 500 });
  }
}
