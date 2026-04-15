/**
 * Visitor ID — Anonymous User Tracking
 * 
 * Generates and persists a UUID in localStorage for anonymous visitor tracking.
 * No login required. The ID survives page reloads but not browser data clearing.
 */
"use client";

const VISITOR_ID_KEY = "skinlytics_visitor_id";

/**
 * Get or create a unique visitor ID.
 * Stored in localStorage so it persists across sessions.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

/**
 * Check if a visitor ID already exists (returning visitor vs first visit).
 */
export function isReturningVisitor(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(VISITOR_ID_KEY) !== null;
}
