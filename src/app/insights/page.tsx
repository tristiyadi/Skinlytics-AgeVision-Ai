/**
 * Page: Insight & Analysis Summary
 * Comprehensive personalized skin insights and recommendations
 * derived from the latest face scan analysis data.
 */
"use client";

import { useCallback } from "react";

import { FeatureHeader } from "@/components/feature-header";
import { NoScanPrompt } from "@/components/no-scan-prompt";
import { useSimulationStore } from "@/store/simulation-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Droplets,
  Sun,
  Heart,
  Leaf,
  Shield,
  BookOpen,
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle,
  Target,
  Sparkles,
  Brain,
  Printer,
  Download,
} from "lucide-react";

export default function InsightsPage() {
  const { analysisResult, capturedImage } = useSimulationStore();

  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
        <FeatureHeader title="Insight & Analysis" badge="AI Insights" />
        <NoScanPrompt />
      </div>
    );
  }

  // Computed metrics
  const skinClarity = 100 - analysisResult.wrinkleScore;
  const hydrationEst = Math.max(30, 95 - analysisResult.wrinkleScore * 0.6);
  const elasticityEst = Math.max(25, 90 - analysisResult.wrinkleScore * 0.7);
  const uvDamageEst = Math.min(80, analysisResult.wrinkleScore * 0.8);
  const skinHealth = Math.round((skinClarity + hydrationEst + elasticityEst + (100 - uvDamageEst)) / 4);

  const getHealthLabel = () => {
    if (skinHealth >= 70) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-500", icon: <CheckCircle className="w-5 h-5" /> };
    if (skinHealth >= 45) return { label: "Moderate", color: "text-amber-600", bg: "bg-amber-500", icon: <AlertTriangle className="w-5 h-5" /> };
    return { label: "Needs Attention", color: "text-red-600", bg: "bg-red-500", icon: <AlertTriangle className="w-5 h-5" /> };
  };

  const healthInfo = getHealthLabel();

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <div className="no-print">
        <FeatureHeader
          title="Insight & Analysis"
          subtitle="Ringkasan analisis kulit dan rekomendasi personal"
          badge="AI Insights"
          backHref="/dashboard"
        />
      </div>

      {/* Print Action Bar */}
      <div className="flex items-center justify-end gap-3 max-w-5xl mx-auto w-full mb-4 no-print">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="rounded-full px-5 gap-2 hover:bg-primary/10 hover:border-primary/40 transition-all"
        >
          <Printer className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Download PDF</span>
          <Download className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Print-only Header (visible only in PDF) */}
      <div className="hidden print-only" style={{ display: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>Skinlytics AgeVision AI</h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Insight & Analysis Summary Report</p>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
            Generated: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {' · '}{analysisResult.gender} · {analysisResult.age} yrs
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full space-y-6 flex-1">
        {/* Hero Score Card */}
        <Card className="border-none shadow-2xl rounded-3xl bg-gradient-to-br from-primary to-[#004a31] text-primary-foreground overflow-hidden print-keep-bg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white/20 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={capturedImage} alt="Scan" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${healthInfo.bg} flex items-center justify-center text-white shadow-lg`}>
                    {healthInfo.icon}
                  </div>
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-bold mb-1">Overall Skin Health</p>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-extrabold tracking-tighter">{skinHealth}</span>
                    <span className="text-2xl text-primary-foreground/50 mb-1">/100</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-white/15 text-white border-white/20 text-[10px] uppercase tracking-wider">
                      {analysisResult.gender} · {analysisResult.age} yrs
                    </Badge>
                    <Badge className={`${healthInfo.bg}/80 text-white border-none text-[10px] uppercase tracking-wider`}>
                      {healthInfo.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
                  <p className="text-2xl font-bold">{skinClarity}%</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary-foreground/60 font-bold">Clarity</p>
                </div>
                <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
                  <p className="text-2xl font-bold">{Math.round(hydrationEst)}%</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary-foreground/60 font-bold">Hydration</p>
                </div>
                <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
                  <p className="text-2xl font-bold">{Math.round(elasticityEst)}%</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary-foreground/60 font-bold">Elasticity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Assessment */}
        <Card className="border-none shadow-xl rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">Penilaian Umum</h3>
                <p className="text-xs text-muted-foreground">AI-generated overall assessment</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysisResult.wrinkleScore < 30
                ? `Dengan skor kesehatan kulit ${skinHealth}/100, kondisi kulit Anda tergolong sangat baik. Tanda-tanda penuaan minimal dengan skor kerutan rendah di ${analysisResult.wrinkleScore}%. Kulit tampak sehat, elastis, dan terhidrasi dengan baik. Estimasi usia biologis ${analysisResult.age} tahun menunjukkan kulit terjaga dengan baik. Pertahankan rutinitas perawatan saat ini dan fokus pada pencegahan untuk menjaga kondisi optimal ini.`
                : analysisResult.wrinkleScore < 55
                ? `Skor kesehatan kulit Anda ${skinHealth}/100 menunjukkan kondisi cukup baik dengan beberapa area yang perlu perhatian. Skor kerutan ${analysisResult.wrinkleScore}% menandakan adanya tanda penuaan ringan, terutama di area dahi dan sudut mata. Dengan estimasi usia biologis ${analysisResult.age} tahun, perawatan rutin dan konsisten dapat membantu memperbaiki dan meningkatkan kualitas kulit secara signifikan.`
                : `Skor ${skinHealth}/100 mengindikasikan kulit Anda memerlukan perhatian ekstra. Dengan skor kerutan ${analysisResult.wrinkleScore}% dan estimasi usia biologis ${analysisResult.age} tahun, terdeteksi tanda-tanda penuaan yang cukup signifikan. Direkomendasikan untuk segera berkonsultasi dengan dermatologis profesional dan memulai rejimen perawatan kulit intensif yang disesuaikan dengan kondisi kulit Anda.`}
            </p>
          </CardContent>
        </Card>

        {/* Detailed Metrics Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skin Clarity */}
          <Card className="border-none shadow-lg rounded-3xl hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Skin Clarity</h4>
                    <span className={`text-xl font-extrabold ${skinClarity >= 70 ? "text-emerald-600" : skinClarity >= 40 ? "text-amber-600" : "text-red-600"}`}>{skinClarity}%</span>
                  </div>
                  <Progress value={skinClarity} className="h-1.5 mt-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <b>Kejernihan Kulit:</b> Skor melambangkan tingkat kemulusan struktur permukaan dari pantulan cahaya.
                {skinClarity >= 70
                  ? " Permukaan kulit Anda terdeteksi sangat rapat dengan intervensi bayangan tekstur minimal. Tekstur kulit halus dan merata."
                  : skinClarity >= 40
                  ? " Terdeteksi beberapa area dengan tekstur tidak merata. Exfoliation rutin dan serum brightening dapat membantu meningkatkan kejernihan."
                  : " Terdeteksi adanya garis lipatan struktural alami yang signifikan. Disarankan perawatan intensif dengan chemical peel atau retinoid."}
              </p>
            </CardContent>
          </Card>

          {/* Hydration */}
          <Card className="border-none shadow-lg rounded-3xl hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Hydration Level</h4>
                    <span className={`text-xl font-extrabold ${hydrationEst >= 70 ? "text-emerald-600" : hydrationEst >= 40 ? "text-amber-600" : "text-red-600"}`}>{Math.round(hydrationEst)}%</span>
                  </div>
                  <Progress value={hydrationEst} className="h-1.5 mt-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <b>Hidrasi Kulit:</b>{" "}
                {hydrationEst >= 70
                  ? "Level hidrasi kulit optimal. Pertahankan asupan air 8 gelas/hari dan gunakan pelembab berbasis hyaluronic acid secara rutin. Hindari produk yang mengandung alkohol berlebihan."
                  : "Level hidrasi kulit perlu ditingkatkan secara signifikan. Gunakan serum hyaluronic acid 2x sehari, moisturizer pelembab, dan pastikan minum minimal 8 gelas air/hari. Pertimbangkan humidifier di ruangan."}
              </p>
            </CardContent>
          </Card>

          {/* Elasticity */}
          <Card className="border-none shadow-lg rounded-3xl hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Elasticity</h4>
                    <span className={`text-xl font-extrabold ${elasticityEst >= 70 ? "text-emerald-600" : elasticityEst >= 40 ? "text-amber-600" : "text-red-600"}`}>{Math.round(elasticityEst)}%</span>
                  </div>
                  <Progress value={elasticityEst} className="h-1.5 mt-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <b>Elastisitas Kulit:</b>{" "}
                {elasticityEst >= 65
                  ? "Kekenyalan kulit baik — kolagen dan elastin terjaga. Pertahankan dengan antioksidan (Vitamin C), retinol ringan, dan pastikan tidur 7-8 jam per malam untuk regenerasi optimal."
                  : "Elastisitas kulit menurun, menandakan penurunan produksi kolagen. Tambahkan retinol dan peptida ke rutinitas malam. Pertimbangkan kolagen supplement dan facial massage untuk stimulasi."}
              </p>
            </CardContent>
          </Card>

          {/* UV Damage */}
          <Card className="border-none shadow-lg rounded-3xl hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">UV Damage Risk</h4>
                    <span className={`text-xl font-extrabold ${uvDamageEst < 30 ? "text-emerald-600" : uvDamageEst < 55 ? "text-amber-600" : "text-red-600"}`}>{Math.round(uvDamageEst)}%</span>
                  </div>
                  <Progress value={uvDamageEst} className="h-1.5 mt-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <b>Proteksi UV:</b>{" "}
                {uvDamageEst < 40
                  ? "Risiko kerusakan UV rendah. Tetap gunakan tabir surya SPF 30+ setiap hari, termasuk saat cuaca mendung. Kebiasaan perlindungan matahari Anda tampak efektif."
                  : "Risiko kerusakan UV cukup tinggi. Wajib gunakan tabir surya SPF 50+ setiap 2 jam saat beraktivitas di luar ruangan. Hindari paparan matahari langsung pukul 10-14 dan gunakan topi/pelindung."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Wrinkle Zone Detail */}
        <Card className="border-none shadow-xl rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">Analisis Zona Kerutan</h3>
                <p className="text-xs text-muted-foreground">Detail tingkat kerutan per area wajah</p>
              </div>
            </div>
            <div className="space-y-3">
              <ZoneInsightRow
                label="Dahi (Forehead)"
                score={analysisResult.wrinkleScore}
                insight={analysisResult.wrinkleScore > 40 ? "Area dahi menunjukkan garis horizontal yang signifikan. Botox atau tretinoin topikal dapat membantu." : "Area dahi terjaga baik dengan garis ekspresi minimal."}
              />
              <Separator />
              <ZoneInsightRow
                label="Sudut Mata Kiri (L Crow's Feet)"
                score={Math.round(analysisResult.wrinkleScore * 0.8)}
                insight={analysisResult.wrinkleScore * 0.8 > 35 ? "Fine lines terdeteksi di sudut mata kiri. Eye cream dengan retinol dan peptida disarankan." : "Area mata kiri dalam kondisi baik dengan kerutan minimal."}
              />
              <Separator />
              <ZoneInsightRow
                label="Sudut Mata Kanan (R Crow's Feet)"
                score={Math.round(analysisResult.wrinkleScore * 0.85)}
                insight={analysisResult.wrinkleScore * 0.85 > 35 ? "Garis kerutan terlihat di sudut mata kanan. Gunakan eye cream secara konsisten setiap malam." : "Sudut mata kanan terjaga baik, pertahankan perawatan saat ini."}
              />
              <Separator />
              <ZoneInsightRow
                label="Lipatan Nasolabial"
                score={Math.round(analysisResult.wrinkleScore * 0.7)}
                insight={analysisResult.wrinkleScore * 0.7 > 30 ? "Lipatan nasolabial terdeteksi cukup dalam. Filler asam hyaluronat atau facial exercise dapat membantu." : "Lipatan nasolabial masih ringan, menjaga hidrasi dapat meminimalisir perkembangannya."}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lifestyle Tips */}
          <Card className="border-none shadow-xl rounded-3xl bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Rekomendasi Gaya Hidup</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lifestyle recommendations</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {analysisResult.age < 30
                      ? "Di usia Anda, fokus pada pencegahan: antioksidan, retinol ringan, tidur 7-8 jam/malam, dan kelola stres untuk regenerasi sel kulit optimal."
                      : analysisResult.age < 45
                      ? "Pertimbangkan untuk menambah retinol, peptida, dan vitamin C ke rutinitas Anda. Tidur berkualitas dan manajemen stres sangat penting."
                      : "Fokus pada perawatan intensif dan anti-aging. Konsultasikan dengan dokter kulit untuk treatment profesional seperti microneedling atau laser."}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Konsumsi makanan kaya antioksidan (berry, sayuran hijau, kacang-kacangan), hindari gula berlebihan, dan pastikan asupan omega-3 yang cukup untuk kesehatan kulit dari dalam.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Olahraga rutin 30 menit/hari meningkatkan sirkulasi darah ke kulit, mempercepat regenerasi sel, dan membantu detoksifikasi alami tubuh.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skincare Routine */}
          <Card className="border-none shadow-xl rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Rekomendasi Rutinitas Harian</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily skincare routine</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-amber-200/30">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2.5 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" /> Pagi
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>• Gentle cleanser</li>
                    <li>• Vitamin C serum</li>
                    <li>• Moisturizer</li>
                    <li>• Sunscreen SPF 30+</li>
                  </ul>
                </div>
                <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-indigo-200/30">
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2.5 flex items-center gap-1.5">
                    🌙 Malam
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>• Double cleanse</li>
                    <li>• {analysisResult.wrinkleScore > 35 ? "Retinol / Retinoid" : "Niacinamide serum"}</li>
                    <li>• Eye cream</li>
                    <li>• Night cream / repair</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 bg-white/60 dark:bg-white/5 rounded-xl p-3 border border-primary/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Weekly Treatment</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {analysisResult.wrinkleScore > 40
                    ? "Exfoliating mask 2x/minggu, sheet mask kolagen 1x/minggu, dan facial massage 10 menit setiap malam."
                    : "Clay mask 1x/minggu untuk pori-pori, sheet mask hidrasi 1x/minggu, dan gentle exfoliation 1-2x/minggu."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Footer */}
        <Card className="border-none shadow-lg rounded-3xl bg-muted/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-muted-foreground/50" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                  Ringkasan: {skinHealth >= 70 ? "Kulit Sehat — Pertahankan Rutinitas" : skinHealth >= 45 ? "Perlu Perhatian — Optimalkan Perawatan" : "Prioritas Tinggi — Konsultasi Dermatologis"}
                </p>
                <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                  Analisis berdasarkan data biometrik terakhir. Rekomendasi bersifat umum dan tidak menggantikan konsultasi medis profesional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ZoneInsightRow({ label, score, insight }: { label: string; score: number; insight: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      <div className="flex items-center gap-3 sm:w-48">
        <span className="text-sm font-bold w-10 text-right">{score}%</span>
        <div className="flex-1">
          <Progress value={score} className="h-2" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed sm:flex-1">{insight}</p>
    </div>
  );
}
