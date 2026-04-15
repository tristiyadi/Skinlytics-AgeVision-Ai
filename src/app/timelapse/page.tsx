/* eslint-disable @next/next/no-img-element */
/**
 * Page 3: Skin Aging Time-Lapse Generator
 * Interactive slider showing AI-simulated aging at different target ages.
 */
"use client";

import { useState, useEffect } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { NoScanPrompt } from "@/components/no-scan-prompt";
import { ConsentDialog } from "@/components/consent-dialog";
import { useSkinSimulation } from "@/hooks/use-skin-simulation";
import { useSimulationStore } from "@/store/simulation-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Wand2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

const AGE_TARGETS = [25, 35, 45, 55, 65];

export default function TimelapsePage() {
  const { analysisResult, capturedImage, hasConsented } = useSimulationStore();
  const { isGenerating, error, simulate, simulatedImages } = useSkinSimulation();
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    if (!isGenerating) { setProgressVal(0); return; }
    const interval = setInterval(() => {
      setProgressVal((p) => Math.min(p + Math.random() * 6, 90));
    }, 600);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Update display when selected age changes and cache has it
  useEffect(() => {
    if (selectedAge !== null) {
      const key = `aging_${selectedAge}`;
      if (simulatedImages[key]) {
        setDisplayImage(simulatedImages[key]);
      }
    } else {
      setDisplayImage(null);
    }
  }, [selectedAge, simulatedImages]);

  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
        <FeatureHeader title="Age Time-Lapse" badge="AI" />
        <NoScanPrompt />
      </div>
    );
  }

  const handleGenerate = async (age: number) => {
    if (!hasConsented) {
      setSelectedAge(age);
      setShowConsent(true);
      return;
    }
    setSelectedAge(age);
    const key = `aging_${age}`;
    if (simulatedImages[key]) {
      setDisplayImage(simulatedImages[key]);
      return;
    }
    const result = await simulate("aging", age);
    if (result) {
      setDisplayImage(result.image);
    }
  };

  const handlePrev = () => {
    const idx = AGE_TARGETS.indexOf(selectedAge ?? AGE_TARGETS[0]);
    if (idx > 0) handleGenerate(AGE_TARGETS[idx - 1]);
  };

  const handleNext = () => {
    const idx = AGE_TARGETS.indexOf(selectedAge ?? AGE_TARGETS[0]);
    if (idx < AGE_TARGETS.length - 1) handleGenerate(AGE_TARGETS[idx + 1]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <FeatureHeader
        title="Aging Time-Lapse"
        subtitle="Simulasi penuaan kulit AI"
        badge="AI"
      />

      {showConsent && (
        <ConsentDialog
          onAccept={() => {
            setShowConsent(false);
            if (selectedAge !== null) handleGenerate(selectedAge);
          }}
          onDecline={() => setShowConsent(false)}
        />
      )}

      <main className="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)] gap-8 max-w-6xl mx-auto w-full flex-1 items-start">
        
        {/* Left Side: Timeline Selector */}
        <div className="order-2 lg:order-1 flex flex-col gap-4">
          <Card className="w-full border-none shadow-xl rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Select Target Age</h3>
              </div>

              {/* Age buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedAge(null);
                    setDisplayImage(null);
                  }}
                  className={`flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border-2 transition-all ${
                    selectedAge === null
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-2xl font-extrabold">{analysisResult.age}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Current</span>
                </button>
                {AGE_TARGETS.map((age) => {
                  const isSelected = selectedAge === age;
                  const isCached = !!simulatedImages[`aging_${age}`];
                  const diff = age - analysisResult.age;
                  return (
                    <button
                      key={age}
                      onClick={() => handleGenerate(age)}
                      disabled={isGenerating}
                      className={`flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border-2 transition-all disabled:opacity-50 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/40 hover:scale-[1.02]"
                      }`}
                    >
                      <span className="text-2xl font-extrabold">{age}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        {diff > 0 ? `+${diff}` : diff} yrs
                      </span>
                      {isCached && (
                        <Badge variant="outline" className="text-[8px] px-1.5 py-0 mt-1 border-green-500 text-green-600 bg-green-500/10">
                          Ready
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Generate All button */}
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  className="w-full rounded-2xl py-6 text-sm font-bold shadow-lg"
                  disabled={isGenerating}
                  onClick={async () => {
                    if (!hasConsented) {
                      setShowConsent(true);
                      return;
                    }
                    for (const age of AGE_TARGETS) {
                      if (!simulatedImages[`aging_${age}`]) {
                        await simulate("aging", age);
                      }
                    }
                  }}
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate All Ages
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          {error && (
            <p className="text-destructive text-sm text-center font-medium bg-destructive/10 p-3 rounded-xl">{error}</p>
          )}

          <div className="bg-muted/50 p-4 rounded-2xl">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ⚠️ <strong>Disclaimer:</strong> Simulasi ini hanya estimasi berdasarkan AI dan bukan prediksi akurat. 
              Penuaan kulit dipengaruhi banyak faktor termasuk genetik, gaya hidup, perlindungan UV, dan perawatan kulit.
            </p>
          </div>
        </div>

        {/* Right Side: Image Display */}
        <div className="order-1 lg:order-2 relative w-full aspect-square rounded-[3rem] overflow-hidden bg-black shadow-2xl border-4 border-white/10 group">
          <img
            src={displayImage || capturedImage}
            alt={selectedAge ? `Age ${selectedAge}` : "Current"}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <Wand2 className="w-12 h-12 text-primary animate-bounce mb-4" />
              <p className="text-white font-bold mb-2">Aging to {selectedAge}...</p>
              <div className="w-48">
                <Progress value={progressVal} className="h-2 bg-white/20" />
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          {selectedAge !== null && !isGenerating && (
            <>
              {AGE_TARGETS.indexOf(selectedAge) > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {AGE_TARGETS.indexOf(selectedAge) < AGE_TARGETS.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </>
          )}

          {/* Age badge on image */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-white font-bold text-sm">
              {selectedAge !== null ? `Age ${selectedAge}` : `Current: ${analysisResult.age} yrs`}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
