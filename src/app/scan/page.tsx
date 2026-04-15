/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFaceAnalysis } from "@/hooks/use-face-analysis";
import { useSimulationStore } from "@/store/simulation-store";
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
  AlertCircle,
  Sparkles,
  LayoutDashboard,
  Clock,
  ShoppingBag,
  MessageCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

function ScanContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "upload" ? "upload" : "camera";
  
  const { isModelLoading, isAnalyzing, result, loadModels, analyzeFace, setResult } = useFaceAnalysis();
  const { setAnalysisResult, setCapturedImage, clearSimulations } = useSimulationStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mode, setMode] = useState<"camera" | "upload">(initialMode);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * Capture the current video frame or uploaded image to base64,
   * then persist to the Zustand store for use by simulation features.
   */
  const captureImageToStore = useCallback((source: HTMLVideoElement | HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    if (source instanceof HTMLVideoElement) {
      canvas.width = source.videoWidth;
      canvas.height = source.videoHeight;
    } else {
      canvas.width = source.naturalWidth;
      canvas.height = source.naturalHeight;
    }
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(source, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
  }, [setCapturedImage]);

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
        captureImageToStore(videoRef.current);
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
          captureImageToStore(img);
          toast.info("Analyzing uploaded image...");
          await analyzeFace(img);
        } catch (err: any) {
          // Handled in hook
        }
      };
    }
  };

  // Persist analysis results to the store whenever they change
  useEffect(() => {
    if (result) {
      setAnalysisResult({
        age: result.age,
        wrinkleScore: result.wrinkles.score,
        wrinkleLevel: result.wrinkles.level,
        gender: result.gender,
      });
      clearSimulations(); // Clear old simulations when new scan is done
    }
  }, [result, setAnalysisResult, clearSimulations]);

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

      <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_450px] gap-8 max-w-6xl mx-auto w-full">
        
        {/* Left Side: Viewfinder */}
        <div className="relative w-full aspect-[3/4] lg:aspect-square rounded-[3rem] overflow-hidden bg-black shadow-2xl border-4 border-white/10 group">
          {isModelLoading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-background/80 backdrop-blur-sm rounded-3xl">
              <Scan className="w-12 h-12 text-primary animate-pulse" />
              <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Neural Engine...</p>
            </div>
          )}
          
          {mode === "camera" ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-[0.5px] border-white/5 grid grid-cols-3 grid-rows-3 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border-[0.5px] border-white/10"></div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 border-2 border-primary/40 rounded-[100px] border-dashed animate-pulse"></div>
              </div>
              <div className="absolute bottom-10 inset-x-0 flex justify-center">
                <Button 
                  size="lg" 
                  disabled={isAnalyzing}
                  className="rounded-full w-24 h-24 bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border-2 border-white/50 shadow-2xl p-0 transition-transform active:scale-90"
                  onClick={handleCapture}
                >
                  {isAnalyzing ? (
                    <RotateCcw className="w-8 h-8 animate-spin" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center">
                      <Scan className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full relative bg-surface-container-low">
              {previewUrl ? (
                <>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover animate-in fade-in duration-500"
                  />
                  <div className="absolute bottom-8 inset-x-0 flex justify-center">
                    <Button 
                      variant="secondary"
                      className="rounded-full bg-black/60 backdrop-blur-xl text-white border border-white/20 hover:bg-black/80 px-8 py-6 text-base"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      <Upload className="w-5 h-5 mr-3" /> Change Photo
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
                  <div className="w-32 h-32 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-primary transform -rotate-3 animate-in zoom-in duration-300">
                    <Upload className="w-12 h-12 rotate-3" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-4 font-headline tracking-tight text-on-surface">Upload Portrait</h3>
                    <p className="text-on-surface-variant text-base max-w-xs leading-relaxed mx-auto">
                      Select a clear, front-facing photo for analysis. Best results are achieved with natural lighting and no makeup.
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    className="rounded-full px-12 py-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    disabled={isAnalyzing || isModelLoading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isAnalyzing ? (
                      <><RotateCcw className="w-6 h-6 mr-3 animate-spin" /> Analyzing Frame...</>
                    ) : (
                      "Select Photo"
                    )}
                  </Button>
                </div>
              )}
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
            </div>
          )}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white/80 text-[10px] uppercase tracking-[0.2em] font-bold border border-white/10">
            <ShieldCheck className="w-3 h-3 text-primary" />
            Local Engine
          </div>
        </div>

        {/* Right Side: Analysis Results Panel */}
        <div className="w-full h-full flex flex-col">
          {result ? (
            <Card className="flex flex-col justify-center w-full min-h-full border-none shadow-2xl bg-gradient-to-br from-primary to-[#004a31] text-primary-foreground rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
              <CardContent className="p-8">
                <div className="flex flex-col mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-primary-foreground/80 text-xs uppercase tracking-widest font-bold">Biometric Age</p>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] uppercase tracking-widest">
                      {result.gender}
                    </Badge>
                  </div>
                  <h2 className="text-7xl font-headline font-extrabold tracking-tighter">
                    {result.age} <span className="text-3xl font-medium text-primary-foreground/60 tracking-normal">yrs</span>
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="bg-black/10 rounded-3xl p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold uppercase tracking-wider">Skin Clarity</span>
                      <span className="font-bold text-lg">{100 - result.wrinkles.score}%</span>
                    </div>
                    <Progress value={100 - result.wrinkles.score} className="h-2 bg-black/20 mb-4" />
                    <div className="text-xs text-white/80 leading-relaxed">
                      <b>Kejernihan Kulit:</b> Skor melambangkan tingkat kemulusan struktur permukaan dari pantulan cahaya. {result.wrinkles.score < 40 ? "Permukaan kulit Anda terdeteksi sangat rapat dengan intervensi bayangan tekstur minimal." : "Terdeteksi adanya garis lipatan struktural alami yang memengaruhi pantulan cahaya pada kulit."}
                    </div>
                  </div>
                  <div className="bg-black/10 rounded-3xl p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold uppercase tracking-wider">Wrinkle Level</span>
                      <span className="font-bold text-lg">{result.wrinkles.score}%</span>
                    </div>
                    <Progress value={result.wrinkles.score} className="h-2 bg-black/20 mb-4" />
                    <div className="text-xs text-white/80 leading-relaxed">
                      <b>Tingkat Kerutan:</b> {result.wrinkles.score}% area dahi dan sudut mata menunjukkan garis tekstur yang dalam. 
                      {result.wrinkles.score > 35 ? " Disarankan untuk mengoptimalkan hidrasi harian (moisturizer) dan penggunaan tabir surya." : " Struktur wajah terjaga dengan sangat baik dan elastis."}
                    </div>
                  </div>
                  
                  {/* Feature Quick Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Link href="/simulate">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border-none h-auto py-3 flex-col gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Simulate</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border-none h-auto py-3 flex-col gap-1">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Dashboard</span>
                      </Button>
                    </Link>
                    <Link href="/timelapse">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border-none h-auto py-3 flex-col gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Time-Lapse</span>
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border-none h-auto py-3 flex-col gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Products</span>
                      </Button>
                    </Link>
                    <Link href="/therapist">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border-none h-auto py-3 flex-col gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold">AI Chat</span>
                      </Button>
                    </Link>
                    <Link href="/report">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border-none h-auto py-3 flex-col gap-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Report</span>
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-2">
                    <Button variant="secondary" className="w-full rounded-2xl bg-white text-primary hover:bg-gray-100 font-bold py-6 text-base shadow-xl" onClick={resetAnalysis}>
                      <RotateCcw className="w-5 h-5 mr-2" /> Reset Diagnostic
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem] text-center p-8 bg-surface/50">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-6">
                <Scan className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-bold text-on-surface mb-2 font-headline">Awaiting Frame Scan Or Upload Face</h4>
              <p className="text-on-surface-variant text-sm max-w-[250px] leading-relaxed">
                Position your face clearly within the frame or upload a portrait to initialize the biometric scan.
              </p>
            </div>
          )}
        </div>
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
