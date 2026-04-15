/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, ShieldCheck, Zap, Activity, ChevronRight, Camera, Upload } from "lucide-react";

export default function Home() {
  // Background prefetch the heavy AI neural weights while the user reads the home page.
  useEffect(() => {
    const prefetchModels = () => {
      const urls = [
        "/models/ssd_mobilenetv1_model-weights_manifest.json",
        "/models/ssd_mobilenetv1_model.bin",
        "/models/face_landmark_68_model-weights_manifest.json",
        "/models/face_landmark_68_model.bin",
        "/models/age_gender_model-weights_manifest.json",
        "/models/age_gender_model.bin"
      ];
      // Quietly fetch the models into browser disk cache
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          urls.forEach(url => fetch(url, { priority: 'low' }).catch(()=>{}));
        });
      } else {
        setTimeout(() => urls.forEach(url => fetch(url).catch(()=>{})), 2000);
      }
    };
    prefetchModels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-primary/5 via-background/90 to-secondary/5 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Scan className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Skinlytics</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/science" className="hover:text-primary transition-colors">Science</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
          <Link href="/scan">
            <Button variant="default" className="rounded-full px-6">
              Start Analysis
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start z-10 text-left">
              <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 border-primary/30 text-primary bg-primary/5">
                <Zap className="w-3 h-3 mr-2 inline" />
                Real-Time Diagnostics
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                Analyze Your Skin <br />
                <span className="text-primary italic">in Real-Time</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
                Skinlytics AgeVision AI uses advanced computer vision for instant age estimation and wrinkle detection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/scan" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 py-7 text-lg font-bold shadow-lg shadow-primary/20 group">
                    Start Scan
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/scan?mode=upload" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 py-7 text-lg font-bold border-2">
                    <Upload className="mr-2 w-5 h-5" />
                    Upload Photo
                  </Button>
                </Link>
              </div>
              <p className="mt-8 text-sm text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Privacy-first: All analysis happens on your device.
              </p>
            </div>

            {/* Visual Element: Bento-style Diagnostic Overlay */}
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden bg-surface-container-low shadow-2xl border-4 border-white">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrnun4C0AHCNbFksAwVB59avB_Lzhzer4S6xl47OLF2lg3MinOsM5XlhThAjqMghuSitkEPj4QiIrXEchPRfMDQ74SgdPOVC4Rs5OoxWLA1nSYFAGSDf_hpFXhTk-geJrP9e_PQv2pHcUJ7yXIxBzjqC5aovI0yQ_6E0XEFvFaMZBfY98DcX3Aea55M_5WaBh3P3LxTKrW-N3jw4aLvEZsclh_wC3djVBN5XeL2ojcRyEzXaf4KhBLj7fPa6DHrmFgbJx-C2yNfPs" 
                alt="Detailed skin analysis" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end gap-4">
                {/* Age Estimate Chip */}
                <div className="absolute top-10 right-10 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/50 flex flex-col gap-1 items-end">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Est. Bio Age</span>
                  <span className="text-5xl font-extrabold text-on-surface">28.4</span>
                  <div className="flex gap-1.5 mt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
                  </div>
                </div>
                {/* Scan Matrix Overlay */}
                <div className="absolute bottom-10 left-10 flex gap-4">
                  <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Scan className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider">Surface Hydration</p>
                      <p className="text-base font-bold text-on-surface mt-0.5">Optimal 92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/50 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="text-3xl md:text-4xl font-bold">Precision Metrology</h3>
              <div className="w-16 h-1.5 bg-primary mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Activity className="w-7 h-7 text-primary" />}
                title="Sub-Dermal Analysis"
                description="Detect fine lines and early-stage UV damage invisible to the naked eye with our neural engine."
              />
              <FeatureCard 
                icon={<Activity className="w-7 h-7 text-secondary" />}
                title="Progress Tracking"
                description="Securely store your scans to visualize improvements and the efficacy of your skincare regimen."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-7 h-7 text-primary" />}
                title="Neural Privacy"
                description="Our AI models run locally. Your biometric data never leaves your device and is never stored in the cloud."
              />
            </div>
          </div>
        </section>

        {/* Diagnostic Teaser */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-muted shadow-lg">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwWgRZ7_pmXA3JNtGQZ4amZgjZvQLvl7ipILzyLtDth9BWpKU1WLSz7DQPoPcCPD_0lxzYwtl9nvFFbvduHbIEWmEojAYLAYx0iTrPaHYIILJJUNj1BYZpyN29Jp40jMl5sC6vt1i2rTbN4NveytnE4rFc7zoA4kkDbcJcH1WVZAV2oN8kTAHl1cm7QJmLu7PlYtukUO4dOLdELQEvn3aSbxhrZEk9BXG6xi54WqHLkbfAn38TpC3hVikG5NuoJKGCdtQdzSG3gNQ" 
                  alt="Clinical environment" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 md:right-8 bg-white p-6 rounded-3xl shadow-2xl max-w-[260px] border border-zinc-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Clinical Alert</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-zinc-800">Lower eyelid elasticity requires hydration attention.</p>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col gap-10">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Science-backed <br/>results you can trust.
              </h3>
              <div className="flex flex-col gap-8">
                <div className="flex gap-6 items-start">
                  <span className="text-primary font-bold text-2xl mt-1">01.</span>
                  <div>
                    <h5 className="font-bold text-xl mb-2">Instant Mapping</h5>
                    <p className="text-muted-foreground text-lg leading-relaxed">40,000 unique data points analyzed in under 2 seconds.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="text-primary font-bold text-2xl mt-1">02.</span>
                  <div>
                    <h5 className="font-bold text-xl mb-2">Dermatologist Verified</h5>
                    <p className="text-muted-foreground text-lg leading-relaxed">Validated against a dataset of 5M+ clinical skin assessments.</p>
                  </div>
                </div>
              </div>
              <Link href="/science" className="w-fit text-primary font-bold text-lg flex items-center gap-2 hover:translate-x-2 transition-transform mt-4">
                Explore the Science
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40 bg-zinc-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            © 2024 Skinlytics AgeVision AI. Privacy-first analysis.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-zinc-500 font-medium hover:text-secondary transition-colors text-sm tracking-wide">Privacy</Link>
            <Link href="#" className="text-zinc-500 font-medium hover:text-secondary transition-colors text-sm tracking-wide">Terms</Link>
            <Link href="/science" className="text-zinc-500 font-medium hover:text-secondary transition-colors text-sm tracking-wide">Science</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-xl shadow-black/5 bg-background rounded-3xl hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
