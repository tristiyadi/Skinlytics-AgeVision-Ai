/**
 * API Route: /api/chat
 * Simple AI skin therapist chat using analysis context.
 * In production, replace with a real LLM integration (Ollama, OpenAI, etc.)
 */
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnalysisContext {
  age: number;
  wrinkleScore: number;
  wrinkleLevel: string;
  gender: string;
}

/**
 * Context-aware skin therapist responses
 * Uses predefined knowledge base for skincare advice.
 */
function generateResponse(message: string, context: AnalysisContext | null, history: ChatMessage[]): string {
  const lowerMsg = message.toLowerCase();

  const ageInfo = context ? `Berdasarkan scan, estimasi usia kulit Anda adalah ${context.age} tahun.` : "";
  const wrinkleInfo = context ? `Skor kerutan Anda: ${context.wrinkleScore}% (${context.wrinkleLevel}).` : "";

  // Greeting
  if (lowerMsg.match(/^(hi|halo|hello|hey|hai|selamat|permisi)/)) {
    return `Halo! 👋 Saya adalah AI Skin Therapist dari Skinlytics. ${context ? `\n\n${ageInfo} ${wrinkleInfo}` : ""}\n\nSaya bisa membantu Anda dengan:\n• 💆 Rekomendasi rutinitas skincare\n• 🧴 Saran produk berdasarkan kondisi kulit\n• 📊 Penjelasan hasil analisis kulit\n• ⏳ Informasi tentang proses penuaan kulit\n\nApa yang ingin Anda tanyakan?`;
  }

  // Wrinkle questions
  if (lowerMsg.match(/(kerut|wrinkle|garis halus|fine line|keriput|anti.?aging)/)) {
    const advice = context && context.wrinkleScore > 50
      ? `Dengan skor kerutan ${context.wrinkleScore}%, saya merekomendasikan rutinitas anti-aging yang intensif:`
      : context
        ? `Dengan skor kerutan ${context.wrinkleScore}%, kulit Anda dalam kondisi yang cukup baik. Untuk pencegahan:`
        : "Berikut rekomendasi anti-aging yang dapat Anda pertimbangkan:";

    return `${advice}\n\n**Rutinitas Pagi:**\n1. 🧼 Gentle cleanser (pH balanced)\n2. 🍊 Vitamin C serum 15-20% — antioksidan & brightening\n3. 💧 Hyaluronic Acid — hidrasi kulit dalam\n4. ☀️ Sunscreen SPF 50+ — wajib setiap hari!\n\n**Rutinitas Malam:**\n1. 🧼 Double cleansing (oil + water-based)\n2. ✨ Retinol 0.25-0.5% — mulai perlahan, 2-3x/minggu\n3. 🧴 Niacinamide 5% — perbaikan barrier kulit\n4. 🌙 Moisturizer ceramide-based\n\n> 💡 **Tips:** Retinol adalah gold standard anti-aging. Mulai dari konsentrasi rendah dan tingkatkan bertahap. Selalu gunakan sunscreen jika memakai retinol!`;
  }

  // Product recommendations
  if (lowerMsg.match(/(produk|product|recommend|rekomendasi|saran|suggest|pakai apa|apa yang bagus)/)) {
    return `Berdasarkan analisis kulit Anda${context ? ` (usia kulit: ${context.age}, kerutan: ${context.wrinkleScore}%)` : ""}:\n\n**🥇 Prioritas Utama:**\n${context && context.wrinkleScore > 50 ? "• **Retinol** — mengurangi kerutan yang sudah ada" : "• **Sunscreen SPF50** — pencegahan adalah kunci"}\n\n**🥈 Sangat Direkomendasikan:**\n• **Vitamin C Serum** — brightening + antioksidan\n• **Hyaluronic Acid** — hidrasi & plumping\n\n**🥉 Pelengkap:**\n• **Niacinamide** — pori & tekstur kulit\n• **Peptide Cream** — stimulasi kolagen\n\n> 💡 Gunakan fitur **Product Visualizer** kami untuk melihat simulasi efek setiap produk pada wajah Anda!`;
  }

  // Moisturizer / hydration
  if (lowerMsg.match(/(moisturizer|pelembab|hidrasi|hydrat|kering|dry)/)) {
    return `**Panduan Hidrasi Kulit:**\n\nKulit yang terhidrasi dengan baik akan terlihat lebih plump dan kerutan terlihat berkurang.\n\n**Langkah Hidrasi:**\n1. 💧 **Hydrating Toner** — siapkan kulit menerima kelembaban\n2. 💧 **Hyaluronic Acid Serum** — menarik kelembaban dari udara\n3. 🧴 **Moisturizer** — mengunci kelembaban\n4. 🌙 **Sleeping Mask** (malam) — hidrasi ekstra\n\n**Bahan Aktif yang Dicari:**\n• Hyaluronic Acid (low & high molecular weight)\n• Ceramides — memperbaiki skin barrier\n• Glycerin — humectant klasik\n• Squalane — emollient ringan\n\n> ⚠️ Hindari: Alkohol berlebih dan fragrance pada produk yang jika kulit Anda sensitif.`;
  }

  // Sunscreen
  if (lowerMsg.match(/(sunscreen|tabir surya|spf|uv|matahari|sun)/)) {
    return `**☀️ Panduan Sunscreen — Produk Anti-Aging #1:**\n\nSunscreen adalah investasi terbaik untuk kulit Anda. Hingga 80% penuaan kulit disebabkan oleh paparan UV!\n\n**Cara Memilih:**\n• SPF 50+ dengan PA++++ (broad spectrum)\n• Pilih **chemical** (ringan) atau **physical** (sensitif-friendly)\n• Re-apply setiap 2-3 jam jika di luar ruangan\n\n**Jumlah yang Tepat:**\n• Wajah: 2 jari (±1/4 sendok teh)\n• Jangan lupa leher dan telinga!\n\n**Rekomendasi Tipe:**\n• 🏖️ Outdoor: SPF50+ waterproof\n• 🏢 Indoor: SPF30-50 dengan tone-up\n• 🧴 Sensitif: Mineral/physical sunscreen`;
  }

  // Aging
  if (lowerMsg.match(/(penuaan|aging|tua|usia|umur|awet muda|age)/)) {
    return `**⏳ Faktor Penuaan Kulit:**\n\n${context ? `Estimasi usia kulit Anda: **${context.age} tahun**\n\n` : ""}**Faktor yang Bisa Dikontrol (80%):**\n• ☀️ Paparan UV — penyebab utama (#1)\n• 🚬 Merokok — mempercepat kerutan\n• 😴 Kurang tidur — menghambat regenerasi\n• 🍭 Gula berlebih — glycation merusak kolagen\n• 😰 Stres — meningkatkan kortisol\n\n**Faktor Genetik (20%):**\n• Tipe kulit dan pigmentasi\n• Predisposisi genetik\n\n**5 Pilar Anti-Aging:**\n1. Sunscreen setiap hari\n2. Retinol malam hari\n3. Antioksidan (Vitamin C)\n4. Hidrasi yang cukup\n5. Tidur 7-8 jam\n\n> 💡 Gunakan fitur **Aging Time-Lapse** untuk melihat simulasi penuaan kulit Anda!`;
  }

  // Analysis explanation
  if (lowerMsg.match(/(analisis|analysis|hasil|result|arti|mean|maksud|jelaskan|explain)/)) {
    if (!context) {
      return "Maaf, saya belum memiliki data analisis kulit Anda. Silakan lakukan scan wajah terlebih dahulu di halaman **Scan**, lalu kembali ke sini untuk mendapatkan penjelasan detail.";
    }

    let skinAssessment = "";
    if (context.wrinkleScore < 25) {
      skinAssessment = "🟢 **Sangat Baik** — Kulit Anda dalam kondisi prima! Fokus pada pencegahan.";
    } else if (context.wrinkleScore < 50) {
      skinAssessment = "🟡 **Baik** — Ada tanda-tanda awal penuaan yang normal. Rutinitas yang tepat bisa membantu.";
    } else if (context.wrinkleScore < 75) {
      skinAssessment = "🟠 **Perlu Perhatian** — Kerutan cukup terlihat. Disarankan rutinitas anti-aging intensif.";
    } else {
      skinAssessment = "🔴 **Perlu Perawatan** — Kerutan signifikan terdeteksi. Konsultasikan dengan dermatologis.";
    }

    return `**📊 Penjelasan Hasil Analisis Kulit Anda:**\n\n**Estimasi Usia Biologis:** ${context.age} tahun\n**Skor Kerutan:** ${context.wrinkleScore}\/100\n**Level Kerutan:** ${context.wrinkleLevel}\n**Gender:** ${context.gender}\n\n**Penilaian Keseluruhan:**\n${skinAssessment}\n\n**Apa Arti Skor Ini?**\n• Skor 0-25: Kulit sangat halus, minim garis\n• Skor 26-50: Garis halus awal, normal sesuai usia\n• Skor 51-75: Kerutan moderat di area kritis\n• Skor 76-100: Kerutan dalam & signifikan\n\n**Area yang Dianalisis:**\n• 🔍 Dahi (forehead)\n• 👁️ Sudut mata kiri (crow's feet)\n• 👁️ Sudut mata kanan (crow's feet)\n\n> 💡 Coba fitur **Treatment Simulator** untuk melihat potensi perbaikan!`;
  }

  // Default response
  return `Terima kasih atas pertanyaan Anda! 😊\n\n${context ? `Berdasarkan data analisis kulit Anda (usia: ${context.age}, kerutan: ${context.wrinkleScore}%), ` : ""}saya bisa membantu Anda dengan topik berikut:\n\n• 🧴 **"Rekomendasi produk"** — saran produk sesuai kulit Anda\n• 💆 **"Cara mengatasi kerutan"** — rutinitas anti-aging\n• ☀️ **"Sunscreen"** — panduan tabir surya\n• 💧 **"Hidrasi"** — tips melembabkan kulit\n• 📊 **"Jelaskan hasil analisis"** — penjelasan detail skor\n• ⏳ **"Penuaan kulit"** — faktor dan pencegahan\n\nSilakan ketik pertanyaan Anda!`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json() as {
      message: string;
      context: AnalysisContext | null;
      history: ChatMessage[];
    };

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = generateResponse(message, context, history || []);

    return NextResponse.json({
      role: "assistant",
      content: response,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
