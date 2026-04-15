/* eslint-disable @next/next/no-img-element */
/**
 * Page 1: AI Skincare Treatment Simulator
 * Shows before/after comparison of AI-simulated skin improvement.
 */
"use client";

import { useState, useEffect } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { NoScanPrompt } from "@/components/no-scan-prompt";
import { BeforeAfter } from "@/components/before-after";
import { ConsentDialog } from "@/components/consent-dialog";
import { useSkinSimulation } from "@/hooks/use-skin-simulation";
import { useSimulationStore } from "@/store/simulation-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, RotateCcw, Wand2, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function SimulatePage() {
  const { analysisResult, capturedImage, hasConsented } = useSimulationStore();
  const { isGenerating, error, simulate, simulatedImages } = useSkinSimulation();
  const [showConsent, setShowConsent] = useState(false);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [progressVal, setProgressVal] = useState(0);

  // Animate progress bar while generating
  useEffect(() => {
    if (!isGenerating) {
      setProgressVal(0);
      return;
    }
    const interval = setInterval(() => {
      setProgressVal((p) => Math.min(p + Math.random() * 8, 92));
    }, 500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Check cache on mount
  useEffect(() => {
    if (simulatedImages["treatment"]) {
      setSimulatedImage(simulatedImages["treatment"]);
    }
  }, [simulatedImages]);

  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
        <FeatureHeader title="Treatment Simulator" badge="AI" />
        <NoScanPrompt />
      </div>
    );
  }

  const handleSimulate = async () => {
    if (!hasConsented) {
      setShowConsent(true);
      return;
    }
    const result = await simulate("treatment");
    if (result) {
      setSimulatedImage(result.image);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <FeatureHeader
        title="Treatment Simulator"
        subtitle="Simulasi perawatan kulit AI"
        badge="AI Powered"
      />

      {showConsent && (
        <ConsentDialog
          onAccept={() => {
            setShowConsent(false);
            handleSimulate();
          }}
          onDecline={() => setShowConsent(false)}
        />
      )}

      <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 max-w-6xl mx-auto w-full flex-1">
        {/* Left: Image display */}
        <div className="w-full">
          {simulatedImage ? (
            <BeforeAfter
              before={capturedImage}
              after={simulatedImage}
              beforeLabel="Current"
              afterLabel="Simulated"
            />
          ) : (
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white/10">
              <img
                src={capturedImage}
                alt="Your face"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                    <Wand2 className="w-10 h-10 text-primary animate-bounce" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">Generating Simulation</p>
                  <p className="text-white/60 text-sm mb-6">Ini mungkin membutuhkan 10-30 detik...</p>
                  <div className="w-64">
                    <Progress value={progressVal} className="h-2 bg-white/20" />
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                  <Button
                    onClick={handleSimulate}
                    className="rounded-full px-10 py-7 text-lg font-bold bg-primary/90 backdrop-blur-xl shadow-2xl shadow-primary/30 hover:bg-primary hover:scale-105 transition-all gap-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    Simulate Treatment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Info panel */}
        <div className="flex flex-col gap-4">
          {/* Analysis Summary */}
          <Card className="border-none shadow-xl rounded-3xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Current Analysis</h3>
              <div className="flex items-end gap-4 mb-6">
                <span className="text-5xl font-extrabold tracking-tighter">{analysisResult.age}</span>
                <span className="text-muted-foreground text-lg mb-1">years</span>
                <Badge variant="outline" className="ml-auto text-xs uppercase tracking-widest">
                  {analysisResult.gender}
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Wrinkle Score</span>
                    <span className="font-bold">{analysisResult.wrinkleScore}%</span>
                  </div>
                  <Progress value={analysisResult.wrinkleScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Skin Clarity</span>
                    <span className="font-bold">{100 - analysisResult.wrinkleScore}%</span>
                  </div>
                  <Progress value={100 - analysisResult.wrinkleScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Info */}
          <Card className="border-none shadow-xl rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Treatment Simulation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Simulasi ini menunjukkan potensi hasil setelah rutinitas perawatan kulit yang konsisten selama 3-6 bulan.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Pengurangan kerutan estimasi 20-40%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Peningkatan hidrasi & kecerahan</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Estimasi waktu: 3-6 bulan konsisten</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error display */}
          {error && (
            <Card className="border-destructive/30 bg-destructive/5 rounded-3xl">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {simulatedImage && (
            <Button
              variant="outline"
              className="rounded-2xl py-5 font-bold w-full"
              onClick={() => {
                setSimulatedImage(null);
                handleSimulate();
              }}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Regenerate Simulation
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
