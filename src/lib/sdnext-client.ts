/**
 * SD.Next REST API Client
 * Communicates with a locally-running SD.Next server (vladmandic/sdnext)
 * for AI image generation, img2img transformations, and upscaling.
 */

const SDNEXT_URL = process.env.SDNEXT_URL || "http://localhost:7860";

function getAuthHeaders(): HeadersInit {
  const user = process.env.SDNEXT_AUTH_USER;
  const pass = process.env.SDNEXT_AUTH_PASS;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (user && pass) {
    headers["Authorization"] =
      `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  }
  return headers;
}

export interface Img2ImgPayload {
  init_images: string[];
  prompt: string;
  negative_prompt?: string;
  steps?: number;
  cfg_scale?: number;
  denoising_strength?: number;
  width?: number;
  height?: number;
  sampler_name?: string;
  seed?: number;
}

export interface Txt2ImgPayload {
  prompt: string;
  negative_prompt?: string;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  sampler_name?: string;
  seed?: number;
}

export interface SDNextResponse {
  images: string[];
  parameters: Record<string, unknown>;
  info: string;
}

export interface ProgressResponse {
  progress: number;
  eta_relative: number;
  state: {
    skipped: boolean;
    interrupted: boolean;
    job: string;
    job_count: number;
    job_no: number;
    sampling_step: number;
    sampling_steps: number;
  };
}

/**
 * Send an img2img request to SD.Next
 */
export async function img2img(
  payload: Img2ImgPayload,
): Promise<SDNextResponse> {
  const body = {
    prompt: payload.prompt,
    negative_prompt:
      payload.negative_prompt ||
      "deformed, blurry, low quality, unrealistic, disfigured, bad anatomy",
    init_images: payload.init_images,
    steps: payload.steps || 28,
    cfg_scale: payload.cfg_scale || 7,
    denoising_strength: payload.denoising_strength || 0.4,
    width: payload.width || 512,
    height: payload.height || 512,
    sampler_name: payload.sampler_name || "DPM++ 2M",
    seed: payload.seed ?? -1,
  };

  const res = await fetch(`${SDNEXT_URL}/sdapi/v1/img2img`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.log("img2img not available");
    throw new Error(
      `AI Model to image not working: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

/**
 * Send a txt2img request to SD.Next
 */
export async function txt2img(
  payload: Txt2ImgPayload,
): Promise<SDNextResponse> {
  const body = {
    prompt: payload.prompt,
    negative_prompt:
      payload.negative_prompt ||
      "deformed, blurry, low quality, unrealistic, disfigured, bad anatomy",
    steps: payload.steps || 28,
    cfg_scale: payload.cfg_scale || 7,
    width: payload.width || 512,
    height: payload.height || 512,
    sampler_name: payload.sampler_name || "DPM++ 2M",
    seed: payload.seed ?? -1,
  };

  const res = await fetch(`${SDNEXT_URL}/sdapi/v1/txt2img`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(
      `AI Model to text not working: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

/**
 * Check SD.Next generation progress
 */
export async function getProgress(): Promise<ProgressResponse> {
  const res = await fetch(`${SDNEXT_URL}/sdapi/v1/progress`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`AI Model progress check failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Upscale an image using SD.Next
 */
export async function upscale(
  imageBase64: string,
  upscaler: string = "ESRGAN_4x",
  scale: number = 2,
): Promise<SDNextResponse> {
  const res = await fetch(`${SDNEXT_URL}/sdapi/v1/extra-single-image`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      image: imageBase64,
      upscaler_1: upscaler,
      upscaling_resize: scale,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI Model upscale failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Check if SD.Next server is available
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${SDNEXT_URL}/sdapi/v1/progress`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
