/* eslint-disable @next/next/no-img-element */
/**
 * Page 4: Personalized Skincare Product Visualizer
 * Shows simulated effects of different skincare products on the user's face.
 */
"use client";

import { useState, useEffect } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { NoScanPrompt } from "@/components/no-scan-prompt";
import { BeforeAfter } from "@/components/before-after";
import { ConsentDialog } from "@/components/consent-dialog";
import { useSkinSimulation } from "@/hooks/use-skin-simulation";
import { useSimulationStore } from "@/store/simulation-store";
import { SKINCARE_PRODUCTS } from "@/lib/simulation-prompts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wand2, CheckCircle, Clock, ArrowRight } from "lucide-react";

export default function ProductsPage() {
  const { analysisResult, capturedImage, hasConsented } = useSimulationStore();
  const { isGenerating, error, simulate, simulatedImages } = useSkinSimulation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    if (!isGenerating) { setProgressVal(0); return; }
    const interval = setInterval(() => {
      setProgressVal((p) => Math.min(p + Math.random() * 7, 90));
    }, 500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (selectedProduct && simulatedImages[selectedProduct]) {
      setDisplayImage(simulatedImages[selectedProduct]);
    }
  }, [selectedProduct, simulatedImages]);

  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
        <FeatureHeader title="Product Visualizer" badge="AI" />
        <NoScanPrompt />
      </div>
    );
  }

  const handleProductSelect = async (productId: string) => {
    if (!hasConsented) {
      setSelectedProduct(productId);
      setShowConsent(true);
      return;
    }

    setSelectedProduct(productId);
    if (simulatedImages[productId]) {
      setDisplayImage(simulatedImages[productId]);
      return;
    }

    const product = SKINCARE_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const result = await simulate(product.type);
    if (result) {
      setDisplayImage(result.image);
    }
  };

  const selectedProductData = SKINCARE_PRODUCTS.find((p) => p.id === selectedProduct);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <FeatureHeader
        title="Product Visualizer"
        subtitle="Simulasi efek produk skincare AI"
        badge="AI"
      />

      {showConsent && (
        <ConsentDialog
          onAccept={() => {
            setShowConsent(false);
            if (selectedProduct) handleProductSelect(selectedProduct);
          }}
          onDecline={() => setShowConsent(false)}
        />
      )}

      <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-8 max-w-6xl mx-auto w-full flex-1">
        {/* Left: Preview */}
        <div className="w-full">
          {displayImage && selectedProduct ? (
            <div className="space-y-4">
              <BeforeAfter
                before={capturedImage}
                after={displayImage}
                beforeLabel="Original"
                afterLabel={selectedProductData?.name || "Simulated"}
              />
              {selectedProductData && (
                <Card className="border-none shadow-lg rounded-2xl" style={{ borderLeft: `4px solid ${selectedProductData.color}` }}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <span className="text-3xl">{selectedProductData.icon}</span>
                    <div>
                      <p className="font-bold">{selectedProductData.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {selectedProductData.timeline}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white/10">
              <img
                src={capturedImage}
                alt="Your face"
                className="w-full h-full object-cover"
              />
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                  <Wand2 className="w-12 h-12 text-primary animate-bounce mb-4" />
                  <p className="text-white font-bold">Simulating {selectedProductData?.name}...</p>
                  <div className="w-48 mt-4">
                    <Progress value={progressVal} className="h-2 bg-white/20" />
                  </div>
                </div>
              )}
              {!isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl text-center">
                    <ArrowRight className="w-6 h-6 text-white mx-auto mb-2" />
                    <p className="text-white text-sm font-medium">Pilih produk di sebelah kanan</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Product Selection */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold px-1 mb-1">
            Pilih Produk Skincare
          </p>

          {SKINCARE_PRODUCTS.map((product) => {
            const isSelected = selectedProduct === product.id;
            const isCached = !!simulatedImages[product.id];
            return (
              <Card
                key={product.id}
                className={`border-2 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                    : "border-transparent shadow-md hover:border-primary/30"
                }`}
                onClick={() => handleProductSelect(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${product.color}20` }}
                    >
                      {product.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm">{product.name}</h4>
                        <Badge variant="outline" className="text-[10px] px-2 py-0" style={{ borderColor: product.color, color: product.color }}>
                          {product.category}
                        </Badge>
                        {isCached && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {product.timeline}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Generate All */}
          <Button
            variant="outline"
            className="rounded-2xl py-5 mt-2 font-bold gap-2"
            disabled={isGenerating}
            onClick={async () => {
              if (!hasConsented) {
                setShowConsent(true);
                return;
              }
              for (const product of SKINCARE_PRODUCTS) {
                if (!simulatedImages[product.id]) {
                  setSelectedProduct(product.id);
                  await simulate(product.type);
                }
              }
            }}
          >
            <Wand2 className="w-4 h-4" />
            Generate All Products
          </Button>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
}
