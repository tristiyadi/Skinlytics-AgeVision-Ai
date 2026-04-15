/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef } from "react";
import { detectWrinkles, WrinkleResult } from "@/lib/wrinkle-detection";
import { toast } from "sonner";

export interface AnalysisResult {
  age: number;
  wrinkles: WrinkleResult;
  gender: string;
}

export function useFaceAnalysis() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const modelsLoaded = useRef(false);
  const faceapiRef = useRef<any>(null);

  const loadModels = useCallback(async () => {
    if (modelsLoaded.current) return;

    try {
      console.log("Loading face-api models from /models...");
      // Dynamic import to avoid SSR issues with TextEncoder
      const faceapi = await import("@vladmandic/face-api");
      faceapiRef.current = faceapi;

      const MODEL_URL = "/models";
      console.log("Loading nets...");
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);

      console.log("All models loaded successfully");
      modelsLoaded.current = true;
      setIsModelLoading(false);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  }, []);

  const analyzeFace = useCallback(
    async (inputElement: HTMLVideoElement | HTMLImageElement) => {
      if (!modelsLoaded.current || !faceapiRef.current) return;

      const faceapi = faceapiRef.current;
      setIsAnalyzing(true);
      try {
        const isVideo = inputElement instanceof HTMLVideoElement;
        const displaySize = {
          width: isVideo ? inputElement.videoWidth : inputElement.naturalWidth,
          height: isVideo
            ? inputElement.videoHeight
            : inputElement.naturalHeight,
        };

        console.log("Starting face detection (SSD)...");
        // Stage 1: Try SSD MobileNet V1 for high accuracy
        let detection = await faceapi
          .detectSingleFace(
            inputElement,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.35 }),
          )
          .withFaceLandmarks()
          .withAgeAndGender();

        // Stage 2: Fallback to TinyFaceDetector if SSD fails
        if (!detection) {
          console.log("SSD failed, trying TinyFaceDetector fallback...");
          detection = await faceapi
            .detectSingleFace(
              inputElement,
              new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.2 }),
            )
            .withFaceLandmarks()
            .withAgeAndGender();
        }

        if (detection) {
          console.log("Face detected!", detection);
          // Create a temporary canvas for wrinkle detection
          const canvas = document.createElement("canvas");
          canvas.width = displaySize.width;
          canvas.height = displaySize.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(inputElement, 0, 0);

          const wrinkles = await detectWrinkles(canvas, detection.landmarks);

          setResult({
            age: Math.round(detection.age),
            gender: detection.gender,
            wrinkles,
          });
        } else {
          const msg =
            "No face detected. Please ensure your face is clearly visible and well-lit.";
          console.warn(msg);
          toast.error(msg);
          throw new Error(msg);
        }
      } catch (error: any) {
        console.error("Analysis error:", error);
        if (error.message && !error.message.includes("No face detected")) {
          toast.error(
            error.message || "An unexpected error occurred during analysis.",
          );
        }
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  return {
    isModelLoading,
    isAnalyzing,
    result,
    loadModels,
    analyzeFace,
    setResult,
  };
}
