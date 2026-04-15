/**
 * Skinlytics Wrinkle Detection Engine
 * Uses landmark-based skin region isolation and edge density analysis.
 */

export interface WrinkleResult {
  score: number;
  level: 'Low' | 'Medium' | 'High';
}

/**
 * Calculates wrinkle score based on edge detection in specific facial regions.
 * @param canvas The canvas containing the face image
 * @param landmarks Face landmarks from face-api.js
 */
export async function detectWrinkles(
  canvas: HTMLCanvasElement,
  landmarks: any
): Promise<WrinkleResult> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Define regions of interest (ROI) based on landmarks
  // Forehead: points above eyebrows
  // Under eyes: points below eye landmarks
  
  // For this implementation, we'll perform a simplified texture analysis
  // on the forehead and outer eye regions (crow's feet).
  
  const regions = [
    getForeheadRegion(landmarks),
    getLeftEyeCornerRegion(landmarks),
    getRightEyeCornerRegion(landmarks),
  ];

  let totalEdgeDensity = 0;

  for (const region of regions) {
    const imageData = ctx.getImageData(region.x, region.y, region.width, region.height);
    totalEdgeDensity += calculateEdgeDensity(imageData);
  }

  // Normalize score (0-100)
  // These thresholds are heuristic and would typically be calibrated with a real dataset
  const rawScore = totalEdgeDensity / regions.length;
  const score = Math.min(Math.max(Math.round(rawScore * 10), 0), 100);

  let level: 'Low' | 'Medium' | 'High' = 'Low';
  if (score > 60) level = 'High';
  else if (score > 30) level = 'Medium';

  return { score, level };
}

/**
 * Simple Sobel-like edge detection to find high-frequency texture changes
 */
function calculateEdgeDensity(imageData: ImageData): number {
  const { data, width, height } = imageData;
  let edgeSum = 0;
  
  // Convert to grayscale and apply horizontal/vertical derivative
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Simple gradient calculation
      const val = (data[idx] + data[idx+1] + data[idx+2]) / 3;
      const right = (data[idx+4] + data[idx+5] + data[idx+6]) / 3;
      const bottom = (data[((y+1)*width + x)*4] + data[((y+1)*width + x)*4+1] + data[((y+1)*width + x)*4+2]) / 3;
      
      const grad = Math.abs(val - right) + Math.abs(val - bottom);
      
      // Threshold to ignore noise and focus on distinct lines
      if (grad > 15) {
        edgeSum += grad;
      }
    }
  }

  // Density = edge intensity / area
  return edgeSum / (width * height);
}

function getForeheadRegion(landmarks: any) {
  const jaw = landmarks.getJawOutline();
  const leftEyebrow = landmarks.getLeftEyeBrow();
  const rightEyebrow = landmarks.getRightEyeBrow();
  
  // Estimate forehead based on eyebrow positions and face width
  const minX = Math.min(...leftEyebrow.map((p: any) => p.x));
  const maxX = Math.max(...rightEyebrow.map((p: any) => p.x));
  const minY = Math.min(...leftEyebrow.map((p: any) => p.y));
  
  const width = maxX - minX;
  const height = width * 0.3; // Estimated forehead height
  
  return {
    x: minX,
    y: minY - height,
    width: width,
    height: height
  };
}

function getLeftEyeCornerRegion(landmarks: any) {
  const leftEye = landmarks.getLeftEye();
  const outerPoint = leftEye[0]; // Outer corner
  
  return {
    x: outerPoint.x - 20,
    y: outerPoint.y - 10,
    width: 25,
    height: 20
  };
}

function getRightEyeCornerRegion(landmarks: any) {
  const rightEye = landmarks.getRightEye();
  const outerPoint = rightEye[3]; // Outer corner
  
  return {
    x: outerPoint.x - 5,
    y: outerPoint.y - 10,
    width: 25,
    height: 20
  };
}
