/**
 * "No Scan Data" Prompt
 * Shown when a user navigates to a feature page without having scanned their face first.
 */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scan, Camera, Upload } from "lucide-react";

export function NoScanPrompt() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 min-h-[60vh]">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-pulse">
        <Scan className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-3 tracking-tight">Scan Required</h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        Fitur ini memerlukan data analisis wajah. Silakan lakukan scan wajah terlebih dahulu untuk menggunakan fitur AI Simulation.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/scan">
          <Button className="rounded-xl px-8 py-6 font-bold gap-2">
            <Camera className="w-5 h-5" />
            Scan dengan Kamera
          </Button>
        </Link>
        <Link href="/scan?mode=upload">
          <Button variant="outline" className="rounded-xl px-8 py-6 font-bold gap-2">
            <Upload className="w-5 h-5" />
            Upload Foto
          </Button>
        </Link>
      </div>
    </div>
  );
}
