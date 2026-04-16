/* eslint-disable @next/next/no-img-element */
/**
 * Page 2: Virtual Dermatology Clinic Dashboard
 * Comprehensive clinical-grade skin analysis dashboard with heatmap visuals.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { NoScanPrompt } from "@/components/no-scan-prompt";
import { useSimulationStore } from "@/store/simulation-store";
import { useScanHistory } from "@/hooks/use-scan-history";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Activity,
  Droplets,
  Sun,
  Eye,
  Scan,
  TrendingDown,
  TrendingUp,
  Sparkles,
  MessageCircle,
  FileText,
  Clock,
  ShoppingBag,
  History,
  Wifi,
  WifiOff,
  CloudUpload,
  Lightbulb,
} from "lucide-react";

export default function DashboardPage() {
  const { analysisResult, capturedImage } = useSimulationStore();
  const { history, isLoading: isHistoryLoading, pendingCount } = useScanHistory();
  const { isOnline } = useNetworkStatus();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Draw heatmap overlay on the face image
  useEffect(() => {
    if (!capturedImage || !canvasRef.current || !analysisResult) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = capturedImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (showHeatmap) {
        // Forehead zone — overlay
        const foreheadY = img.height * 0.12;
        const foreheadH = img.height * 0.15;
        const foreheadX = img.width * 0.25;
        const foreheadW = img.width * 0.5;
        drawHeatZone(ctx, foreheadX, foreheadY, foreheadW, foreheadH, analysisResult.wrinkleScore, "Forehead");

        // Left crow's feet
        const leftEyeX = img.width * 0.15;
        const leftEyeY = img.height * 0.32;
        drawHeatZone(ctx, leftEyeX, leftEyeY, img.width * 0.12, img.height * 0.08, analysisResult.wrinkleScore * 0.8, "L-Eye");

        // Right crow's feet
        const rightEyeX = img.width * 0.73;
        const rightEyeY = img.height * 0.32;
        drawHeatZone(ctx, rightEyeX, rightEyeY, img.width * 0.12, img.height * 0.08, analysisResult.wrinkleScore * 0.85, "R-Eye");

        // Nasolabial fold zones
        const nLeftX = img.width * 0.3;
        const nLeftY = img.height * 0.5;
        drawHeatZone(ctx, nLeftX, nLeftY, img.width * 0.08, img.height * 0.15, analysisResult.wrinkleScore * 0.7, "");

        const nRightX = img.width * 0.62;
        const nRightY = img.height * 0.5;
        drawHeatZone(ctx, nRightX, nRightY, img.width * 0.08, img.height * 0.15, analysisResult.wrinkleScore * 0.7, "");
      }
    };
  }, [capturedImage, analysisResult, showHeatmap]);

  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
        <FeatureHeader title="Derma Dashboard" badge="Clinical" />
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

  function getScoreColor(score: number) {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  }

  function getScoreBg(score: number) {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <FeatureHeader
        title="Dermatology Dashboard"
        subtitle="Analisis klinis kulit komprehensif"
        badge="Clinical"
        backHref="/"
      />

      {/* AI Features Top Bar */}
      <nav className="flex gap-2 overflow-x-auto pb-2 mb-4 max-w-7xl mx-auto w-full scrollbar-hide">
        <Link href="/simulate">
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 whitespace-nowrap hover:bg-primary/10 hover:border-primary/40 transition-all">
            <Sparkles className="w-4 h-4 text-primary" />
            Treatment
          </Button>
        </Link>
        <Link href="/timelapse">
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 whitespace-nowrap hover:bg-primary/10 hover:border-primary/40 transition-all">
            <Clock className="w-4 h-4 text-primary" />
            Age Time-Lapse
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 whitespace-nowrap hover:bg-primary/10 hover:border-primary/40 transition-all">
            <ShoppingBag className="w-4 h-4 text-primary" />
            Products
          </Button>
        </Link>
        <Link href="/therapist">
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 whitespace-nowrap hover:bg-primary/10 hover:border-primary/40 transition-all">
            <MessageCircle className="w-4 h-4 text-primary" />
            AI Therapist
          </Button>
        </Link>
        <Link href="/report">
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 whitespace-nowrap hover:bg-primary/10 hover:border-primary/40 transition-all">
            <FileText className="w-4 h-4 text-primary" />
            Clinical Report
          </Button>
        </Link>
        <Link href="/insights">
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 whitespace-nowrap hover:bg-amber-500/10 hover:border-amber-500/40 border-amber-500/20 transition-all">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Insights
          </Button>
        </Link>
      </nav>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full flex-1">
        {/* Left Column: Face with Heatmap */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <div className="relative">
              <canvas ref={canvasRef} className="w-full h-auto rounded-t-3xl" />
              <div className="absolute top-4 right-4">
                <Button
                  variant={showHeatmap ? "default" : "secondary"}
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  {showHeatmap ? "Hide" : "Show"} Heatmap
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Wrinkle Density Heatmap</p>
                <div className="flex gap-1 items-center text-xs">
                  <span className="w-3 h-3 rounded bg-green-500/50" /> Low
                  <span className="w-3 h-3 rounded bg-amber-500/50 ml-2" /> Medium
                  <span className="w-3 h-3 rounded bg-red-500/50 ml-2" /> High
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scan History */}
          <Card className="border-none shadow-lg rounded-3xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <History className="w-3.5 h-3.5" />
                  Scan History
                </h3>
                <div className="flex items-center gap-1.5">
                  {pendingCount > 0 && (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px] py-0 h-5">
                      <CloudUpload className="w-3 h-3 mr-1" />
                      {pendingCount}
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-[10px] py-0 h-5 ${isOnline ? "text-green-500 border-green-500/30" : "text-amber-500 border-amber-500/30"}`}>
                    {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>

              {isHistoryLoading ? (
                <div className="text-center py-4 text-muted-foreground text-xs">Loading...</div>
              ) : history.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {history.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {scan.estimatedAge}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold">
                            Age {scan.estimatedAge} · {scan.wrinkleLevel}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(scan.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-primary">
                          {scan.overallHealth ?? Math.round(100 - scan.wrinkleScore)}%
                        </p>
                        <p className="text-[9px] text-muted-foreground">Health</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-xs">
                  {isOnline ? "No scan history yet" : "History available when online"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metrics Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Overall Health Score */}
          <Card className="border-none shadow-xl rounded-3xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-bold">Overall Skin Health</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-6xl font-extrabold tracking-tighter">{skinHealth}</span>
                    <span className="text-2xl text-primary-foreground/60 mb-1">/100</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs uppercase tracking-wider">
                    {analysisResult.gender} · {analysisResult.age} yrs
                  </Badge>
                  <div className="flex items-center gap-1 text-primary-foreground/70 text-sm">
                    {skinHealth >= 60 ? (
                      <><TrendingUp className="w-4 h-4" /> Good condition</>
                    ) : (
                      <><TrendingDown className="w-4 h-4" /> Needs attention</>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={<Activity className="w-5 h-5" />}
              label="Skin Clarity"
              value={skinClarity}
              desc="Kemulusan permukaan"
              color={getScoreColor(skinClarity)}
              bgColor={getScoreBg(skinClarity)}
            />
            <MetricCard
              icon={<Droplets className="w-5 h-5" />}
              label="Hydration Est."
              value={Math.round(hydrationEst)}
              desc="Estimasi kelembaban"
              color={getScoreColor(hydrationEst)}
              bgColor={getScoreBg(hydrationEst)}
            />
            <MetricCard
              icon={<Eye className="w-5 h-5" />}
              label="Elasticity"
              value={Math.round(elasticityEst)}
              desc="Kekenyalan kulit"
              color={getScoreColor(elasticityEst)}
              bgColor={getScoreBg(elasticityEst)}
            />
            <MetricCard
              icon={<Sun className="w-5 h-5" />}
              label="UV Damage Risk"
              value={Math.round(uvDamageEst)}
              desc="Risiko kerusakan UV"
              color={getScoreColor(100 - uvDamageEst)}
              bgColor={getScoreBg(100 - uvDamageEst)}
            />
          </div>

          {/* Zone Analysis */}
          <Card className="border-none shadow-xl rounded-3xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                <Scan className="w-4 h-4 inline mr-2" />
                Zone Analysis
              </h3>
              <div className="space-y-4">
                <ZoneRow label="Dahi (Forehead)" score={analysisResult.wrinkleScore} />
                <ZoneRow label="Sudut Mata Kiri (L Crow&apos;s Feet)" score={Math.round(analysisResult.wrinkleScore * 0.8)} />
                <ZoneRow label="Sudut Mata Kanan (R Crow&apos;s Feet)" score={Math.round(analysisResult.wrinkleScore * 0.85)} />
                <ZoneRow label="Lipatan Nasolabial" score={Math.round(analysisResult.wrinkleScore * 0.7)} />
              </div>
            </CardContent>
          </Card>


        </div>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  desc,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  desc: string;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="border-none shadow-lg rounded-2xl hover:-translate-y-0.5 transition-transform">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <span className={`text-3xl font-extrabold ${color}`}>{value}%</span>
        </div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
        <Progress value={value} className={`h-1.5 mt-3`} />
      </CardContent>
    </Card>
  );
}

function ZoneRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium flex-1">{label}</span>
      <span className="text-sm font-bold w-12 text-right">{score}%</span>
      <div className="w-32">
        <Progress value={score} className="h-2" />
      </div>
    </div>
  );
}

function drawHeatZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  intensity: number,
  label: string
) {
  // Color: green → amber → red based on intensity
  let r: number, g: number, b: number;

  if (intensity < 35) {
    r = 34; g = 197; b = 94; // green
  } else if (intensity < 65) {
    r = 245; g = 158; b = 11; // amber
  } else {
    r = 239; g = 68; b = 68; // red
  }

  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
  ctx.beginPath();
  const rx = w / 2;
  const ry = h / 2;
  ctx.ellipse(x + rx, y + ry, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Label
  if (label) {
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
    ctx.textAlign = "center";
    ctx.fillText(label, x + rx, y - 5);
  }
}
