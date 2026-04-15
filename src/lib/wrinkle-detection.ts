/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Skinlytics Wrinkle Detection Engine
 * Uses landmark-based skin region isolation and edge density analysis.
 */

export interface WrinkleResult {
  score: number;
  level: "Low" | "Medium" | "High";
}

/**
 * Calculates wrinkle score based on edge detection in specific facial regions.
 * @param canvas The canvas containing the face image
 * @param landmarks Face landmarks from face-api.js
 */
export async function detectWrinkles(
  canvas: HTMLCanvasElement,
  landmarks: any,
): Promise<WrinkleResult> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // 1. Define regions of interest (ROI) based on landmarks
  // Forehead: points above eyebrows
  // Under eyes: points below eye landmarks

  // For this implementation, we'll perform a simplified texture analysis
  // on the forehead and outer eye regions (crow's feet).

  const regions = [
    getForeheadRegion(landmarks, canvas.width, canvas.height),
    getLeftEyeCornerRegion(landmarks, canvas.width, canvas.height),
    getRightEyeCornerRegion(landmarks, canvas.width, canvas.height),
  ];

  let totalEdgeDensity = 0;

  for (const region of regions) {
    // Avoid zero area or out of bounds
    if (region.width <= 0 || region.height <= 0) continue;

    // Ensure safety with integer coordinates
    const x = Math.max(0, Math.floor(region.x));
    const y = Math.max(0, Math.floor(region.y));
    const w = Math.min(canvas.width - x, Math.floor(region.width));
    const h = Math.min(canvas.height - y, Math.floor(region.height));

    if (w <= 0 || h <= 0) continue;

    const imageData = ctx.getImageData(x, y, w, h);
    totalEdgeDensity += calculateEdgeDensity(imageData);
  }

  // Normalize score (0-100)
  // Refined Heuristic:
  // After testing, an average density of ~1.0-2.0 is often 'normal' skin.
  // Deep wrinkles can reach 5.0-8.0+.
  const avgDensity = totalEdgeDensity / regions.length;

  // Adjusted mapping: map 1.5 -> 20 (Low), 4.0 -> 50 (Med), 8.0 -> 100 (High)
  // Using a soft exponential or linear fit that's more forgiving
  const score = Math.min(Math.max(Math.round(avgDensity * 12 - 5), 0), 100);

  let level: "Low" | "Medium" | "High" = "Low";
  if (score > 70) level = "High";
  else if (score > 35) level = "Medium";

  return { score, level };
}

/**
 * Simple Sobel-like edge detection to find high-frequency texture changes
 */
function calculateEdgeDensity(imageData: ImageData): number {
  const { data, width, height } = imageData;
  let edgeSum = 0;

  // Convert to grayscale and apply horizontal/vertical derivative
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = (y * width + x) * 4;

      // Grayscale conversion (Luminance)
      const val =
        data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      const right =
        data[idx + 4] * 0.299 + data[idx + 5] * 0.587 + data[idx + 6] * 0.114;
      const bottom =
        data[((y + 1) * width + x) * 4] * 0.299 +
        data[((y + 1) * width + x) * 4 + 1] * 0.587 +
        data[((y + 1) * width + x) * 4 + 2] * 0.114;

      const grad = Math.abs(val - right) + Math.abs(val - bottom);

      // Higher threshold to distinguish wrinkles from normal skin pores/noise
      // Increase from 15 to 25 to be more selective
      if (grad > 25) {
        edgeSum += grad / 255;
      }
    }
  }

  // Density = edge counts / area normalized
  return (edgeSum * 100) / (width * height);
}

function getForeheadRegion(landmarks: any, canvasW: number, canvasH: number) {
  const leftEyebrow = landmarks.getLeftEyeBrow();
  const rightEyebrow = landmarks.getRightEyeBrow();

  const minX = Math.min(...leftEyebrow.map((p: any) => p.x));
  const maxX = Math.max(...rightEyebrow.map((p: any) => p.x));
  const minY = Math.min(...leftEyebrow.map((p: any) => p.y));

  const width = maxX - minX;
  const height = width * 0.35;

  return {
    x: Math.max(0, minX),
    y: Math.max(0, minY - height),
    width: Math.min(width, canvasW),
    height: height,
  };
}

function getLeftEyeCornerRegion(landmarks: any, canvasW: number, canvasH: number) {
  const leftEye = landmarks.getLeftEye();
  const outerPoint = leftEye[0]; // Outer corner

  const startX = Math.max(0, outerPoint.x - 20);
  const startY = Math.max(0, outerPoint.y - 10);

  return {
    x: startX,
    y: startY,
    width: Math.min(25, canvasW - startX),
    height: Math.min(20, canvasH - startY),
  };
}

function getRightEyeCornerRegion(
  landmarks: any,
  canvasW: number,
  canvasH: number,
) {
  const rightEye = landmarks.getRightEye();
  const outerPoint = rightEye[3]; // Outer corner

  const startX = Math.max(0, outerPoint.x - 5);
  const startY = Math.max(0, outerPoint.y - 10);

  return {
    x: startX,
    y: startY,
    width: Math.min(25, canvasW - startX),
    height: Math.min(20, canvasH - startY),
  };
}
