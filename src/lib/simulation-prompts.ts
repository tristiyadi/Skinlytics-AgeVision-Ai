/**
 * Prompt Engineering for Skinlytics AI Simulations
 * Generates optimized prompts for SD.Next based on analysis results.
 */

export type SimulationType = "treatment" | "aging" | "product" | "retinol" | "vitaminc" | "hyaluronic" | "sunscreen" | "niacinamide";

export interface AnalysisInput {
  age: number;
  wrinkleScore: number;
  wrinkleLevel: "Low" | "Medium" | "High";
  gender: string;
}

const BASE_QUALITY = "professional portrait photo, ultra detailed skin texture, natural studio lighting, sharp focus, 8k uhd";
const BASE_NEGATIVE = "deformed, blurry, low quality, unrealistic, disfigured, bad anatomy, cartoon, painting, illustration, drawing, text, watermark, logo, overexposed, underexposed";

/**
 * Build a simulation prompt based on analysis results and simulation type
 */
export function buildPrompt(analysis: AnalysisInput, type: SimulationType): { prompt: string; negative_prompt: string; denoising_strength: number } {
  const genderTerm = analysis.gender === "male" ? "man" : "woman";

  switch (type) {
    case "treatment":
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, clear healthy radiant skin, smooth forehead, reduced wrinkles, even skin tone, moisturized glowing complexion, youthful revitalized appearance, natural look after professional skincare treatment`,
        negative_prompt: `${BASE_NEGATIVE}, wrinkles, aged skin, dry skin, dark spots, redness`,
        denoising_strength: analysis.wrinkleScore > 60 ? 0.45 : 0.35,
      };

    case "retinol":
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, smooth refined skin texture, reduced fine lines especially around eyes and forehead, even skin tone, retinol treatment result, improved skin cell turnover, slight healthy glow, minimized pores`,
        negative_prompt: `${BASE_NEGATIVE}, deep wrinkles, rough texture, large pores, uneven skin`,
        denoising_strength: 0.38,
      };

    case "vitaminc":
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, bright radiant luminous complexion, reduced hyperpigmentation, no dark spots, vitamin c serum glow, antioxidant protected skin, vibrant even skin tone, healthy natural radiance`,
        negative_prompt: `${BASE_NEGATIVE}, dull skin, dark spots, hyperpigmentation, uneven tone, sallow`,
        denoising_strength: 0.35,
      };

    case "hyaluronic":
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, intensely hydrated plump skin, dewy moisturized finish, reduced wrinkle depth, bouncy elastic skin, hyaluronic acid glow, supple well-hydrated complexion, smooth filled-in fine lines`,
        negative_prompt: `${BASE_NEGATIVE}, dry skin, dehydrated, flaky, rough texture, deep wrinkles`,
        denoising_strength: 0.35,
      };

    case "sunscreen":
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, protected even-toned complexion, no sun damage, no dark spots, no redness, clear uniform skin tone, healthy sun-protected skin, natural finish, matte or dewy sunscreen look`,
        negative_prompt: `${BASE_NEGATIVE}, sunburn, sun damage, dark spots, redness, uneven pigmentation, freckles`,
        denoising_strength: 0.3,
      };

    case "niacinamide":
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, minimized pores, balanced oil production, strengthened skin barrier, reduced redness, even smooth skin texture, calm clear complexion, niacinamide treatment result`,
        negative_prompt: `${BASE_NEGATIVE}, large pores, oily skin, redness, blotchy, uneven texture`,
        denoising_strength: 0.35,
      };

    case "aging":
      // This is handled separately with age-specific prompts
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, natural aging`,
        negative_prompt: BASE_NEGATIVE,
        denoising_strength: 0.5,
      };

    default:
      return {
        prompt: `${BASE_QUALITY}, portrait of a ${genderTerm}, healthy clear skin, natural look`,
        negative_prompt: BASE_NEGATIVE,
        denoising_strength: 0.35,
      };
  }
}

/**
 * Build aging-specific prompts for time-lapse generation
 */
export function buildAgingPrompt(analysis: AnalysisInput, targetAge: number): { prompt: string; negative_prompt: string; denoising_strength: number } {
  const genderTerm = analysis.gender === "male" ? "man" : "woman";
  const ageDiff = targetAge - analysis.age;

  if (targetAge <= 25) {
    return {
      prompt: `${BASE_QUALITY}, portrait of a young ${genderTerm} in their early 20s, smooth youthful skin, no wrinkles, firm elastic skin, bright even complexion, full collagen, tight jawline, natural youthful appearance`,
      negative_prompt: `${BASE_NEGATIVE}, wrinkles, aged, sagging, fine lines, dark spots, mature`,
      denoising_strength: Math.min(0.55, 0.3 + Math.abs(ageDiff) * 0.005),
    };
  } else if (targetAge <= 35) {
    return {
      prompt: `${BASE_QUALITY}, portrait of a ${genderTerm} in their early 30s, minimal fine lines, healthy skin with very slight signs of aging, good skin elasticity, slight laugh lines, natural complexion`,
      negative_prompt: `${BASE_NEGATIVE}, deep wrinkles, very aged, sagging jowls, heavy aging`,
      denoising_strength: Math.min(0.5, 0.3 + Math.abs(ageDiff) * 0.005),
    };
  } else if (targetAge <= 45) {
    return {
      prompt: `${BASE_QUALITY}, portrait of a ${genderTerm} in their mid 40s, moderate fine lines around eyes and forehead, subtle crow's feet, slight nasolabial folds, natural mature appearance, some early age spots`,
      negative_prompt: `${BASE_NEGATIVE}, extremely aged, very deep wrinkles, very sagging skin`,
      denoising_strength: Math.min(0.55, 0.3 + Math.abs(ageDiff) * 0.005),
    };
  } else if (targetAge <= 55) {
    return {
      prompt: `${BASE_QUALITY}, portrait of a ${genderTerm} in their mid 50s, visible wrinkles on forehead and around eyes, noticeable crow's feet, defined nasolabial folds, some skin laxity, age spots, mature dignified appearance`,
      negative_prompt: `${BASE_NEGATIVE}, extremely deformed, cartoon`,
      denoising_strength: Math.min(0.6, 0.35 + Math.abs(ageDiff) * 0.005),
    };
  } else {
    return {
      prompt: `${BASE_QUALITY}, portrait of a ${genderTerm} in their mid 60s, prominent wrinkles, deep forehead lines and crow's feet, visible jowls, age spots, thinner skin, silver or graying hair at temples, wise dignified elderly appearance`,
      negative_prompt: `${BASE_NEGATIVE}, extremely deformed, cartoon`,
      denoising_strength: Math.min(0.65, 0.4 + Math.abs(ageDiff) * 0.005),
    };
  }
}

/**
 * Product definitions for the Product Visualizer
 */
export const SKINCARE_PRODUCTS = [
  {
    id: "retinol",
    name: "Retinol 0.5%",
    category: "Anti-Aging",
    icon: "✨",
    color: "#E8A87C",
    description: "Accelerates cell turnover, reduces fine lines and wrinkles, promotes collagen production.",
    timeline: "4-12 weeks for visible results",
    type: "retinol" as SimulationType,
  },
  {
    id: "vitaminc",
    name: "Vitamin C Serum",
    category: "Brightening",
    icon: "🍊",
    color: "#FFB347",
    description: "Powerful antioxidant that brightens skin, fades dark spots, and protects against UV damage.",
    timeline: "2-4 weeks for glow, 8-12 weeks for dark spots",
    type: "vitaminc" as SimulationType,
  },
  {
    id: "hyaluronic",
    name: "Hyaluronic Acid",
    category: "Hydration",
    icon: "💧",
    color: "#87CEEB",
    description: "Intense hydration that plumps skin, reduces wrinkle depth, and improves skin barrier.",
    timeline: "Immediate hydration, 4-8 weeks for wrinkle reduction",
    type: "hyaluronic" as SimulationType,
  },
  {
    id: "sunscreen",
    name: "Sunscreen SPF50",
    category: "Protection",
    icon: "☀️",
    color: "#F0E68C",
    description: "Prevents UV damage, dark spots, and premature aging. The single most effective anti-aging product.",
    timeline: "Protection is immediate, visible results over months",
    type: "sunscreen" as SimulationType,
  },
  {
    id: "niacinamide",
    name: "Niacinamide 10%",
    category: "Pore & Texture",
    icon: "🧴",
    color: "#B4D7A8",
    description: "Minimizes pores, controls oil, strengthens skin barrier, and reduces redness.",
    timeline: "2-4 weeks for oil control, 8-12 weeks for pores",
    type: "niacinamide" as SimulationType,
  },
] as const;
