import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  name: text("name"),
});

export const scans = pgTable("scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const results = pgTable("results", {
  id: uuid("id").primaryKey().defaultRandom(),
  scanId: uuid("scan_id").references(() => scans.id).notNull(),
  estimatedAge: integer("estimated_age").notNull(),
  wrinkleScore: integer("wrinkle_score").notNull(),
  wrinkleLevel: text("wrinkle_level").notNull(),
});
