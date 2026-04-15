/**
 * Hook: useScanHistory
 * Manages saving scan results to the backend and loading scan history.
 * Works offline-first: queues saves when offline, syncs when back online.
 */
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { getVisitorId } from "@/lib/visitor";

export interface ScanRecord {
  id: string;
  visitorId: string;
  createdAt: string;
  estimatedAge: number;
  wrinkleScore: number;
  wrinkleLevel: string;
  gender: string;
  skinClarity: number | null;
  hydrationEstimate: number | null;
  elasticityEstimate: number | null;
  uvDamageEstimate: number | null;
  overallHealth: number | null;
  source: string;
}

interface PendingScan {
  visitorId: string;
  estimatedAge: number;
  wrinkleScore: number;
  wrinkleLevel: string;
  gender: string;
  source: string;
  timestamp: number;
}

const PENDING_SCANS_KEY = "skinlytics_pending_scans";

function getPendingScans(): PendingScan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_SCANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setPendingScans(scans: PendingScan[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(scans));
}

export function useScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const syncAttempted = useRef(false);

  /**
   * Save a scan result — tries API first, queues to localStorage if offline.
   */
  const saveScan = useCallback(
    async (data: {
      estimatedAge: number;
      wrinkleScore: number;
      wrinkleLevel: string;
      gender: string;
    }): Promise<boolean> => {
      const visitorId = getVisitorId();
      if (!visitorId) return false;

      const payload = {
        visitorId,
        ...data,
        source: "client",
      };

      setIsSaving(true);
      try {
        const res = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          // Successfully saved — also refresh history
          loadHistory();
          return true;
        }

        // Server error — queue for later
        queuePendingScan(payload);
        return false;
      } catch {
        // Network error — queue for later (offline)
        queuePendingScan(payload);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  /**
   * Queue a scan for later sync when back online.
   */
  const queuePendingScan = (payload: Omit<PendingScan, "timestamp">) => {
    const pending = getPendingScans();
    pending.push({ ...payload, timestamp: Date.now() });
    setPendingScans(pending);
    console.log(`[ScanHistory] Queued scan for offline sync (${pending.length} pending)`);
  };

  /**
   * Sync any pending offline scans to the server.
   */
  const syncPendingScans = useCallback(async (): Promise<number> => {
    const pending = getPendingScans();
    if (pending.length === 0) return 0;

    let synced = 0;
    const remaining: PendingScan[] = [];

    for (const scan of pending) {
      try {
        const res = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scan),
        });

        if (res.ok) {
          synced++;
        } else {
          remaining.push(scan);
        }
      } catch {
        remaining.push(scan);
      }
    }

    setPendingScans(remaining);
    if (synced > 0) {
      console.log(`[ScanHistory] Synced ${synced} pending scans`);
      loadHistory();
    }
    return synced;
  }, []);

  /**
   * Load scan history from the server.
   */
  const loadHistory = useCallback(async () => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/scans?visitorId=${visitorId}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.scans || []);
      }
    } catch {
      // Offline — history not available
      console.log("[ScanHistory] Could not load history (offline?)");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-sync pending scans when coming online
  useEffect(() => {
    const handleOnline = () => {
      syncPendingScans();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncPendingScans]);

  // Load history on mount (once)
  useEffect(() => {
    if (!syncAttempted.current) {
      syncAttempted.current = true;
      syncPendingScans().then(() => loadHistory());
    }
  }, [syncPendingScans, loadHistory]);

  const pendingCount = typeof window !== "undefined" ? getPendingScans().length : 0;

  return {
    history,
    isLoading,
    isSaving,
    saveScan,
    loadHistory,
    syncPendingScans,
    pendingCount,
  };
}
