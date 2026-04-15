/**
 * Hook: useSkinSimulation
 * Manages AI skin simulation requests to the SD.Next backend.
 */
"use client";

import { useState, useCallback } from "react";
import { useSimulationStore } from "@/store/simulation-store";
import type { SimulationType } from "@/lib/simulation-prompts";

interface SimulationResult {
  image: string;
  prompt: string;
}

export function useSkinSimulation() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { simulatedImages, setSimulatedImage, capturedImage, analysisResult } = useSimulationStore();

  const simulate = useCallback(
    async (type: SimulationType, targetAge?: number): Promise<SimulationResult | null> => {
      if (!capturedImage || !analysisResult) {
        setError("No face scan data available. Please scan your face first.");
        return null;
      }

      // Check cache
      const cacheKey = targetAge !== undefined ? `${type}_${targetAge}` : type;
      if (simulatedImages[cacheKey]) {
        return { image: simulatedImages[cacheKey], prompt: "" };
      }

      setIsGenerating(true);
      setError(null);

      try {
        const res = await fetch("/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: capturedImage,
            analysisResult: {
              age: analysisResult.age,
              wrinkleScore: analysisResult.wrinkleScore,
              wrinkleLevel: analysisResult.wrinkleLevel,
              gender: analysisResult.gender,
            },
            simulationType: type,
            targetAge,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(data.error || `Server error: ${res.status}`);
        }

        const data = await res.json();
        setSimulatedImage(cacheKey, data.image);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Simulation failed";
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [capturedImage, analysisResult, simulatedImages, setSimulatedImage]
  );

  const checkServer = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      return data.online;
    } catch {
      return false;
    }
  }, []);

  return { isGenerating, error, simulate, checkServer, simulatedImages };
}
