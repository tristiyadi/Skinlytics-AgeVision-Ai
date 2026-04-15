/**
 * Consent Dialog Component
 * Shows a privacy consent dialog before sending face data to SD.Next server.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, X, Server } from "lucide-react";
import { useSimulationStore } from "@/store/simulation-store";

interface ConsentDialogProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentDialog({ onAccept, onDecline }: ConsentDialogProps) {
  const [checked, setChecked] = useState(false);
  const { setConsented } = useSimulationStore();

  const handleAccept = () => {
    setConsented(true);
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="max-w-lg w-full border-none shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Privacy Consent</h3>
                <p className="text-white/70 text-sm">Persetujuan Privasi</p>
              </div>
            </div>
            <button onClick={onDecline} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                Fitur simulasi AI memerlukan pemrosesan gambar wajah Anda di server. 
                Gambar akan dikirim ke server AI Model lokal untuk menghasilkan simulasi.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Server className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Gambar diproses oleh server <strong>lokal</strong> Anda — tidak dikirim ke cloud.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Gambar akan <strong>langsung dihapus</strong> setelah simulasi selesai.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada data yang disimpan atau dibagikan ke pihak ketiga.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-1 w-4 h-4 accent-primary"
              />
              <span className="text-sm leading-relaxed">
                Saya mengerti dan setuju bahwa gambar wajah saya akan diproses secara lokal untuk menghasilkan simulasi AI.
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl py-5"
                onClick={onDecline}
              >
                Tolak
              </Button>
              <Button
                className="flex-1 rounded-xl py-5 font-bold"
                disabled={!checked}
                onClick={handleAccept}
              >
                Setuju & Lanjutkan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
