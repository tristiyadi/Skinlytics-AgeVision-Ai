/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFaceAnalysis } from "@/hooks/use-face-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  ChevronLeft, 
  RotateCcw, 
  Upload, 
  Scan, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

function ScanContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "upload" ? "upload" : "camera";
  
  const { isModelLoading, isAnalyzing, result, loadModels, analyzeFace, setResult } = useFaceAnalysis();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mode, setMode] = useState<"camera" | "upload">(initialMode);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const enableCamera = async () => {
      if (mode !== "camera") return;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        toast.error("Could not access camera. Please check permissions.");
      }
    };

    if (mode === "camera") {
      enableCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraActive(false);
    };
  }, [mode]);

  const handleCapture = async () => {
    if (videoRef.current && isCameraActive) {
      try {
        await analyzeFace(videoRef.current);
      } catch (err: any) {
        // Handled in hook
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = async () => {
        try {
          toast.info("Analyzing uploaded image...");
          await analyzeFace(img);
        } catch (err: any) {
          // Handled in hook
        }
      };
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex bg-muted rounded-full p-1 shadow-sm">
          <Button 
            variant={mode === "camera" ? "default" : "ghost"} 
            size="sm" 
            className="rounded-full px-4"
            onClick={() => setMode("camera")}
          >
            <Camera className="w-4 h-4 mr-2" /> Camera
          </Button>
          <Button 
            variant={mode === "upload" ? "default" : "ghost"} 
            size="sm" 
            className="rounded-full px-4"
            onClick={() => setMode("upload")}
          >
            <Upload className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
        {isModelLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Scan className="w-12 h-12 text-primary animate-pulse" />
            <p className="text-muted-foreground animate-pulse">Initializing AI Models...</p>
          </div>
        ) : (
          <>
            {/* Analysis Result Card */}
            {result && (
              <Card className="w-full mb-6 border-none shadow-xl bg-primary text-primary-foreground overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-primary-foreground/80 text-sm uppercase tracking-wider font-bold">Estimated Profile</p>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] uppercase">
                          {result.gender}
                        </Badge>
                      </div>
                      <h2 className="text-5xl font-bold">{result.age} <span className="text-2xl font-normal text-primary-foreground/60">years</span></h2>
                    </div>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-3 py-1">
                      Skin Clarity: {100 - result.wrinkles.score}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span>Wrinkle Level: <b className="uppercase tracking-wide">{result.wrinkles.level}</b></span>
                        <span>{result.wrinkles.score}%</span>
                      </div>
                      <Progress value={result.wrinkles.score} className="h-2 bg-white/20" />
                    </div>
                    
                    <div className="pt-2 flex gap-2">
                       <Button 
                        variant="secondary" 
                        className="flex-1 rounded-full bg-white text-primary hover:bg-gray-100 font-bold"
                        onClick={resetAnalysis}
                       >
                         <RotateCcw className="w-4 h-4 mr-2" /> New Analysis
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Viewfinder Area */}
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white/10 group">
              {mode === "camera" ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-[0.5px] border-white/5 grid grid-cols-3 grid-rows-3 opacity-30">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border-[0.5px] border-white/10"></div>
                    ))}
                  </div>
                  
                  {/* Face Guide UI */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-80 border-2 border-primary/20 rounded-[100px] border-dashed animate-pulse"></div>
                  </div>

                  {/* Camera Controls */}
                  <div className="absolute bottom-10 inset-x-0 flex justify-center">
                    <Button 
                      size="lg" 
                      disabled={isAnalyzing}
                      className="rounded-full w-20 h-20 bg-white hover:bg-gray-100 text-primary border-8 border-gray-100 shadow-2xl p-0 transition-transform active:scale-90"
                      onClick={handleCapture}
                    >
                      {isAnalyzing ? (
                        <RotateCcw className="w-8 h-8 animate-spin" />
                      ) : (
                        <div className="w-12 h-12 rounded-full border-4 border-primary" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full relative">
                  {previewUrl ? (
                    <>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover animate-in fade-in duration-500"
                      />
                      <div className="absolute bottom-6 inset-x-0 flex justify-center">
                        <Button 
                          variant="secondary"
                          className="rounded-full bg-black/50 backdrop-blur-md text-white border-white/20 hover:bg-black/70"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isAnalyzing}
                        >
                          <Upload className="w-4 h-4 mr-2" /> Change Photo
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-8 bg-gray-900/10 backdrop-blur-sm">
                      <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary transform rotate-6 animate-in zoom-in duration-300">
                        <Upload className="w-10 h-10 -rotate-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">Upload Portrait</h3>
                        <p className="text-muted-foreground text-sm max-w-[280px] leading-relaxed">
                          Select a clear photo of your face for analysis. Best results are achieved with natural lighting and no makeup.
                        </p>
                      </div>
                      <Button 
                        variant="default" 
                        className="rounded-full px-10 py-7 text-lg font-bold shadow-xl shadow-primary/20"
                        disabled={isAnalyzing}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isAnalyzing ? (
                          <><RotateCcw className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                        ) : (
                          "Select Photo"
                        )}
                      </Button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-60">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Secure Biometric Engine Active
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
       <div className="flex-1 flex flex-col items-center justify-center space-y-4 h-screen">
          <Scan className="w-12 h-12 text-primary animate-bounce" />
       </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
