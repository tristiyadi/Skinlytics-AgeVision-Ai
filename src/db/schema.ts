/**
 * Database Schema — Skinlytics AgeVision AI
 * 
 * Designed for anonymous visitors (no login required).
 * Each visitor gets a UUID stored in localStorage.
 * Scan history is persisted to PostgreSQL via Neon.
 */
import { pgTable, uuid, text, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";

/**
 * Visitors — anonymous unique users tracked by client-generated UUID.
 * No login needed; the visitor_id is stored in the browser's localStorage.
 */
export const visitors = pgTable("visitors", {
  id: uuid("id").primaryKey(),  // Client-generated UUID
  firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
  totalScans: integer("total_scans").default(0).notNull(),
});

/**
 * Scans — each face analysis result is stored as a scan record.
 */
export const scans = pgTable("scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: uuid("visitor_id").references(() => visitors.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // Analysis results
  estimatedAge: integer("estimated_age").notNull(),
  wrinkleScore: real("wrinkle_score").notNull(),
  wrinkleLevel: text("wrinkle_level").notNull(),  // "Low" | "Medium" | "High"
  gender: text("gender").notNull(),

  // Computed metrics (derived from wrinkle score)
  skinClarity: real("skin_clarity"),
  hydrationEstimate: real("hydration_estimate"),
  elasticityEstimate: real("elasticity_estimate"),
  uvDamageEstimate: real("uv_damage_estimate"),
  overallHealth: real("overall_health"),

  // Optional: thumbnail (small base64 or omitted for privacy)
  thumbnailUrl: text("thumbnail_url"),

  // Metadata
  source: text("source").default("client").notNull(),  // "client" | "api"
  deviceInfo: jsonb("device_info"),
});
