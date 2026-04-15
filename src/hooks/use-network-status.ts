/**
 * Hook: useNetworkStatus
 * Detects online/offline status for PWA mode.
 * Provides real-time connectivity info so the app can decide whether
 * to use local ML (offline) or server API (online) for analysis.
 */
"use client";

import { useState, useEffect, useCallback } from "react";

interface NetworkStatus {
  isOnline: boolean;
  /** When the connection state last changed */
  lastChanged: Date | null;
  /** Manually check connectivity by pinging the server */
  checkConnection: () => Promise<boolean>;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(true);
  const [lastChanged, setLastChanged] = useState<Date | null>(null);

  // Initialize from navigator on mount
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }
  }, []);

  // Listen for browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChanged(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastChanged(new Date());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Active connectivity check — pings our own API
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const online = res.ok;
      setIsOnline(online);
      return online;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, []);

  return { isOnline, lastChanged, checkConnection };
}
