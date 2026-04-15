/**
 * API Route: /api/health
 * Quick check for SD.Next server availability.
 */
import { NextResponse } from "next/server";
import { checkHealth } from "@/lib/sdnext-client";

export async function GET() {
  const isOnline = await checkHealth();
  return NextResponse.json({ online: isOnline });
}
