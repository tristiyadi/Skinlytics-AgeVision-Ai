/**
 * Global Simulation State Store (Zustand)
 * Persists analysis results across pages so simulation features
 * can access the latest face scan data.
 */
import { create } from "zustand";

export interface AnalysisResult {
  age: number;
  wrinkleScore: number;
  wrinkleLevel: "Low" | "Medium" | "High";
  gender: string;
}

interface SimulationStore {
  // Latest face analysis
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult) => void;

  // Captured face image (base64)
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;

  // Simulation results cache
  simulatedImages: Record<string, string>;
  setSimulatedImage: (key: string, image: string) => void;
  clearSimulations: () => void;

  // Privacy consent
  hasConsented: boolean;
  setConsented: (value: boolean) => void;

  // SD.Next server status
  isServerOnline: boolean;
  setServerOnline: (value: boolean) => void;
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),

  capturedImage: null,
  setCapturedImage: (image) => set({ capturedImage: image }),

  simulatedImages: {},
  setSimulatedImage: (key, image) =>
    set((state) => ({
      simulatedImages: { ...state.simulatedImages, [key]: image },
    })),
  clearSimulations: () => set({ simulatedImages: {} }),

  hasConsented: false,
  setConsented: (value) => set({ hasConsented: value }),

  isServerOnline: false,
  setServerOnline: (value) => set({ isServerOnline: value }),
}));
