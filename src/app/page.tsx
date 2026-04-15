"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, ShieldCheck, Zap, Activity, ChevronRight, Camera, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Scan className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Skinlytics</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#science" className="hover:text-primary transition-colors">Science</Link>
            <Link href="#privacy" className="hover:text-primary transition-colors">Privacy</Link>
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
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <Badge variant="outline" className="mb-6 rounded-full px-4 py-1 border-primary/30 text-primary bg-primary/5">
              AI-Powered Skin Diagnostics
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
              Analyze Your Skin in <span className="text-primary italic">Real-Time</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Skinlytics AgeVision AI uses advanced computer vision for instant age estimation and wrinkle detection. Professional insights from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/scan" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 group">
                  <Camera className="mr-2 w-5 h-5" />
                  Start Live Scan
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/scan?mode=upload" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-2">
                  <Upload className="mr-2 w-5 h-5" />
                  Upload Photo
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Privacy-first: All analysis happens securely on your device.
            </p>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Metrology</h2>
              <p className="text-muted-foreground">Science-backed results you can trust.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-primary" />}
                title="Instant Analysis"
                description="40,000 unique data points analyzed in under 2 seconds for immediate feedback."
              />
              <FeatureCard 
                icon={<Activity className="w-6 h-6 text-secondary" />}
                title="Sub-Dermal Insights"
                description="Detect fine lines and early-stage UV damage invisible to the naked eye with our neural engine."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6 text-primary" />}
                title="Neural Privacy"
                description="Our AI models run locally. Your biometric data never leaves your device and is never stored in the cloud."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to track your skin&apos;s vitality?</h2>
            <Link href="/scan">
              <Button size="lg" className="rounded-full px-12 py-8 text-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Scan className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold tracking-tight">Skinlytics AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Skinlytics AgeVision AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Science</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-xl shadow-black/5 bg-background hover:translate-y-[-4px] transition-transform">
      <CardContent className="pt-8">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
