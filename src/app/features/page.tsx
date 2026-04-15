import Link from "next/link";
import { ArrowLeft, Activity, ShieldCheck, Zap, Scan, Layers, FileDown } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary/20">
      {/* Header / Nav */}
      <div className="container mx-auto px-6 pt-12 pb-16 max-w-5xl">
        <Link href="/" className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider hover:text-primary-container transition-colors mb-16">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Terminal
        </Link>

        {/* Hero */}
        <div className="mb-24 text-center md:text-left flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-container font-bold text-xs uppercase tracking-widest mb-6">
              Platform Features
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Precision <br />
              <span className="text-primary italic">Metrology.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
              Explore the advanced suite of clinical-grade tools embedded within AgeVision AI. Engineered for deep accuracy and absolute privacy.
            </p>
          </div>
          <div className="w-full md:w-1/3 aspect-square relative rounded-[3rem] overflow-hidden bg-surface-container-low p-8 flex items-center justify-center shadow-xl border-4 border-white">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
            <div className="relative z-10 w-32 h-32 rounded-full bg-white/50 backdrop-blur-xl border border-white flex items-center justify-center shadow-2xl">
               <Scan className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute bottom-6 right-6">
               <span className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">Core Engine</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          <div className="p-10 rounded-[2.5rem] bg-surface-container-lowest shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sub-Dermal Analysis</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Detects fine lines, early-stage UV damage, and structural volume loss invisible to the naked eye. Our neural engine scores elasticity zones on a medical scale.
              </p>
            </div>
            <div className="mt-8 bg-surface-container-low p-4 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-sm font-medium text-on-surface">Detects structural changes at 0.1mm</span>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-surface-container-lowest shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Texture Density Mapping</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                By cross-referencing your skin\'s topography against 5M+ clinical profiles, the platform generates a high-definition localized density map to identify early wrinkle formation.
              </p>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-surface-container-lowest shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Neural Evaluation</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                40,000 unique data points analyzed locally in exactly 1.8 seconds. Utilizing localized mobile-net weights to deliver instantaneous biological age estimation.
              </p>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-surface-container-lowest shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Sovereign Privacy</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                No Cloud. No Uploads. The model processes video buffers securely on your local graphics processor, erasing the biometric frames frame by frame.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/privacy" className="text-sm font-bold text-primary flex items-center hover:translate-x-1 transition-transform">
                Read Privacy Architecture <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </Link>
            </div>
          </div>

        </div>

        {/* CTA section inside features */}
        <div className="relative overflow-hidden rounded-[3rem] bg-surface-container-low p-12 md:p-20 text-center flex flex-col items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Start Tracking Your Progress</h2>
            <p className="text-xl text-on-surface-variant max-w-2xl mb-10 relative z-10">
              Launch the scanner now to baseline your skin\'s metrics. Data is held locally allowing you to visually track skincare regimen results over time.
            </p>
            <Link href="/scan" className="relative z-10 bg-primary hover:bg-primary-container text-white py-4 px-10 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Launch Diagnostic
            </Link>
        </div>
      </div>
    </div>
  );
}
