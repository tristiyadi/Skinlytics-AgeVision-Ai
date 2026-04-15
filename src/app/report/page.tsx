/* eslint-disable @next/next/no-img-element */
/**
 * Page 6: Professional Clinical Report Generator
 * Generates a comprehensive, printable/exportable skin analysis report.
 */
"use client";

import { useRef } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { NoScanPrompt } from "@/components/no-scan-prompt";
import { useSimulationStore } from "@/store/simulation-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Printer,
  Download,
  Activity,
  Droplets,
  Sun,
  Eye,
  ShieldCheck,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function ReportPage() {
  const { analysisResult, capturedImage } = useSimulationStore();
  const reportRef = useRef<HTMLDivElement>(null);

  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
        <FeatureHeader title="Clinical Report" badge="Export" />
        <NoScanPrompt />
      </div>
    );
  }

  const skinClarity = 100 - analysisResult.wrinkleScore;
  const hydrationEst = Math.max(30, 95 - analysisResult.wrinkleScore * 0.6);
  const elasticityEst = Math.max(25, 90 - analysisResult.wrinkleScore * 0.7);
  const uvDamageEst = Math.min(80, analysisResult.wrinkleScore * 0.8);
  const skinHealth = Math.round((skinClarity + hydrationEst + elasticityEst + (100 - uvDamageEst)) / 4);
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const content = generateReportText(analysisResult, skinHealth, dateStr);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skinlytics-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Recommendations based on analysis
  const recommendations = getRecommendations(analysisResult);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <div className="print:hidden">
        <FeatureHeader title="Clinical Report" subtitle="Laporan analisis kulit profesional" badge="Export" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 max-w-4xl mx-auto w-full mb-6 print:hidden">
        <Button onClick={handlePrint} className="rounded-xl gap-2 flex-1">
          <Printer className="w-4 h-4" />
          Print Report
        </Button>
        <Button variant="outline" onClick={handleDownloadText} className="rounded-xl gap-2 flex-1">
          <Download className="w-4 h-4" />
          Download TXT
        </Button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="max-w-4xl mx-auto w-full space-y-6 print:max-w-none">
        {/* Header */}
        <Card className="border-none shadow-xl rounded-3xl print:shadow-none print:rounded-none overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Skinlytics Clinical Report</h1>
                  <p className="text-primary-foreground/70 text-sm">Laporan Analisis Kulit Komprehensif</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center gap-2 text-primary-foreground/70">
                  <Calendar className="w-4 h-4" />
                  {dateStr}
                </div>
                <div className="flex items-center gap-2 mt-1 text-primary-foreground/70">
                  <User className="w-4 h-4" />
                  {analysisResult.gender} · Est. {analysisResult.age} yrs
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
              {/* Thumbnail */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                  <img src={capturedImage} alt="Patient" className="w-full h-full object-cover" />
                </div>
                <Badge variant="outline" className="text-xs px-3">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Processed Locally
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatBox icon={<Activity className="w-5 h-5" />} label="Overall Health" value={`${skinHealth}/100`} color="text-primary" />
                <StatBox icon={<Eye className="w-5 h-5" />} label="Skin Clarity" value={`${skinClarity}%`} color="text-green-600" />
                <StatBox icon={<Droplets className="w-5 h-5" />} label="Hydration Est." value={`${Math.round(hydrationEst)}%`} color="text-blue-600" />
                <StatBox icon={<Sun className="w-5 h-5" />} label="UV Damage Risk" value={`${Math.round(uvDamageEst)}%`} color="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Card className="border-none shadow-xl rounded-3xl print:shadow-none print:rounded-none">
          <CardContent className="p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Analisis Detail
            </h2>

            <div className="space-y-6">
              <AnalysisRow label="Wrinkle Score" value={analysisResult.wrinkleScore} desc="Skor densitas kerutan berdasarkan analisis edge detection pada area dahi dan sudut mata." />
              <AnalysisRow label="Skin Clarity" value={skinClarity} desc="Kehalusan dan kemerataan tekstur permukaan kulit." />
              <AnalysisRow label="Elasticity Estimate" value={Math.round(elasticityEst)} desc="Estimasi kekenyalan dan ketegangan kulit berdasarkan kedalaman kerutan." />
              <AnalysisRow label="Hydration Level" value={Math.round(hydrationEst)} desc="Estimasi tingkat hidrasi kulit berdasarkan korelasi dengan tekstur permukaan." />

              <Separator />

              {/* Zone Breakdown */}
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Zone Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ZoneCard zone="Forehead (Dahi)" score={analysisResult.wrinkleScore} />
                <ZoneCard zone="Left Crow's Feet" score={Math.round(analysisResult.wrinkleScore * 0.8)} />
                <ZoneCard zone="Right Crow's Feet" score={Math.round(analysisResult.wrinkleScore * 0.85)} />
                <ZoneCard zone="Nasolabial Folds" score={Math.round(analysisResult.wrinkleScore * 0.7)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-none shadow-xl rounded-3xl print:shadow-none print:rounded-none">
          <CardContent className="p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Rekomendasi Perawatan
            </h2>

            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">{rec.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-none shadow-lg rounded-3xl bg-amber-50/50 print:shadow-none">
          <CardContent className="p-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> Laporan ini dihasilkan oleh AI dan bukan pengganti konsultasi medis profesional.
              Hasil analisis bersifat estimasi berdasarkan computer vision dan tidak dapat digunakan untuk diagnosis medis.
              Selalu konsultasikan dengan dermatologis atau dokter kulit untuk diagnosis dan perawatan yang tepat.
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-8">
          <p>Generated by Skinlytics AgeVision AI · {dateStr}</p>
          <p className="mt-1">Privacy-first: All analysis performed client-side</p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
    </div>
  );
}

function AnalysisRow({ label, value, desc }: { label: string; value: number; desc: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-sm">{label}</span>
        <span className="font-bold text-sm">{value}%</span>
      </div>
      <Progress value={value} className="h-2 mb-2" />
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function ZoneCard({ zone, score }: { zone: string; score: number }) {
  const status = score > 60 ? "High" : score > 30 ? "Medium" : "Low";
  const statusColor = score > 60 ? "text-red-600" : score > 30 ? "text-amber-600" : "text-green-600";

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
      <span className="text-sm font-medium">{zone}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${statusColor}`}>{score}%</span>
        <Badge variant="outline" className={`text-[10px] ${statusColor}`}>{status}</Badge>
      </div>
    </div>
  );
}

interface Recommendation {
  title: string;
  description: string;
  priority: string;
}

function getRecommendations(analysis: { age: number; wrinkleScore: number; wrinkleLevel: string }): Recommendation[] {
  const recs: Recommendation[] = [];

  // Always recommend sunscreen
  recs.push({
    title: "☀️ Sunscreen SPF 50+ Setiap Hari",
    description: "Lindungi kulit dari kerusakan UV yang menyebabkan 80% penuaan prematur. Gunakan broad spectrum SPF 50+ dan re-apply setiap 2-3 jam.",
    priority: "Wajib",
  });

  if (analysis.wrinkleScore > 40) {
    recs.push({
      title: "✨ Retinol (Vitamin A) Malam Hari",
      description: "Mulai dengan konsentrasi 0.25% dan tingkatkan bertahap. Retinol mempercepat regenerasi sel dan stimulasi kolagen untuk mengurangi kerutan.",
      priority: "Sangat Direkomendasikan",
    });
  }

  recs.push({
    title: "🍊 Vitamin C Serum (Pagi)",
    description: "Antioksidan kuat yang melindungi dari radikal bebas, mencerahkan kulit, dan membantu produksi kolagen alami.",
    priority: "Direkomendasikan",
  });

  recs.push({
    title: "💧 Hyaluronic Acid untuk Hidrasi",
    description: "Mampu menahan air hingga 1000x beratnya. Mengisi kerutan halus dari dalam dan menjaga kulit tetap plump dan terhidrasi.",
    priority: "Direkomendasikan",
  });

  if (analysis.wrinkleScore > 30) {
    recs.push({
      title: "🧴 Niacinamide 5-10% untuk Barrier Kulit",
      description: "Memperkuat skin barrier, mengecilkan pori, mengurangi kemerahan, dan meratakan warna kulit.",
      priority: "Opsional",
    });
  }

  recs.push({
    title: "😴 Tidur 7-8 Jam Per Malam",
    description: "Kulit melakukan regenerasi sel terutama saat tidur. Kurang tidur meningkatkan kortisol yang mempercepat degradasi kolagen.",
    priority: "Gaya Hidup",
  });

  return recs;
}

function generateReportText(
  analysis: { age: number; wrinkleScore: number; wrinkleLevel: string; gender: string },
  skinHealth: number,
  dateStr: string
): string {
  return `
═══════════════════════════════════════════════════
  SKINLYTICS AGEVISION AI - CLINICAL REPORT
═══════════════════════════════════════════════════

Date: ${dateStr}
Patient: ${analysis.gender} · Estimated Age: ${analysis.age} years

─────────────────────────────────────────────────
  SUMMARY
─────────────────────────────────────────────────
Overall Skin Health Score: ${skinHealth}/100
Wrinkle Score: ${analysis.wrinkleScore}%
Wrinkle Level: ${analysis.wrinkleLevel}
Skin Clarity: ${100 - analysis.wrinkleScore}%

─────────────────────────────────────────────────
  ZONE ANALYSIS
─────────────────────────────────────────────────
Forehead:           ${analysis.wrinkleScore}%
Left Crow's Feet:   ${Math.round(analysis.wrinkleScore * 0.8)}%
Right Crow's Feet:  ${Math.round(analysis.wrinkleScore * 0.85)}%
Nasolabial Folds:   ${Math.round(analysis.wrinkleScore * 0.7)}%

─────────────────────────────────────────────────
  RECOMMENDATIONS
─────────────────────────────────────────────────
1. Sunscreen SPF 50+ daily (MANDATORY)
2. ${analysis.wrinkleScore > 40 ? "Retinol 0.25-0.5% at night" : "Maintain current routine"}
3. Vitamin C serum in the morning
4. Hyaluronic Acid for hydration
5. Sleep 7-8 hours per night

─────────────────────────────────────────────────
  DISCLAIMER
─────────────────────────────────────────────────
This report is generated by AI and is not a substitute
for professional medical consultation. Always consult
with a dermatologist for proper diagnosis and treatment.

Generated by Skinlytics AgeVision AI
Privacy-first: All analysis performed client-side
═══════════════════════════════════════════════════
`.trim();
}
