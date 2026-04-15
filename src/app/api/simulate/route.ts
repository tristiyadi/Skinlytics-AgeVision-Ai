/**
 * API Route: /api/simulate
 * Sends face image + analysis results to SD.Next for AI simulation.
 * Supports treatment, aging, and product simulation types.
 */
import { NextRequest, NextResponse } from "next/server";
import { img2img, checkHealth } from "@/lib/sdnext-client";
import {
  buildPrompt,
  buildAgingPrompt,
  type SimulationType,
  type AnalysisInput,
} from "@/lib/simulation-prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, analysisResult, simulationType, targetAge } = body as {
      image: string;
      analysisResult: AnalysisInput;
      simulationType: SimulationType;
      targetAge?: number;
    };

    if (!image || !analysisResult || !simulationType) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: image, analysisResult, simulationType",
        },
        { status: 400 },
      );
    }

    // Check SD.Next availability
    const isOnline = await checkHealth();
    if (!isOnline) {
      return NextResponse.json(
        {
          error: "AI Model is not available. Please ensure it is running.",
        },
        { status: 503 },
      );
    }

    // Build the appropriate prompt
    let promptData;
    if (simulationType === "aging" && targetAge !== undefined) {
      promptData = buildAgingPrompt(analysisResult, targetAge);
    } else {
      promptData = buildPrompt(analysisResult, simulationType);
    }

    // Strip the data URI prefix if present
    const base64Image = image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const result = await img2img({
      init_images: [base64Image],
      prompt: promptData.prompt,
      negative_prompt: promptData.negative_prompt,
      denoising_strength: promptData.denoising_strength,
      steps: 28,
      cfg_scale: 7,
      width: 512,
      height: 512,
      sampler_name: "DPM++ 2M",
    });

    if (!result.images || result.images.length === 0) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      image: `data:image/png;base64,${result.images[0]}`,
      prompt: promptData.prompt,
    });
  } catch (error: unknown) {
    console.error("Simulation API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
