import Link from "next/link";
import { ArrowLeft, Brain, Activity, ShieldCheck } from "lucide-react";

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/20">
      <div className="container mx-auto px-6 pt-12 pb-24 max-w-4xl">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider hover:text-primary-container transition-colors mb-16">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Terminal
        </Link>

        {/* Hero Section */}
        <div className="mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            The Science of <br />
            <span className="text-primary italic">Vitality</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Skinlytics AgeVision AI is powered by advanced neural architecture, trained on millions of clinical data points to deliver dermatological-grade precision directly to your device.
          </p>
        </div>

        {/* Methodology Section */}
        <div className="space-y-24">
          
          <section className="relative p-12 md:p-16 rounded-[40px] bg-surface-container-lowest shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="w-16 h-16 rounded-full bg-primary-container/20 flex flex-shrink-0 items-center justify-center text-primary">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-3xl font-bold">Neural Methodology</h2>
                </div>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
                  Our system utilizes a customized SSD MobileNet V1 architecture, optimized for high-fidelity facial landmark detection. By analyzing 68 distinct nodal points, the engine decodes the micro-topography of your skin.
                </p>
                <div className="bg-surface-container-low p-6 rounded-2xl">
                  <p className="text-sm font-medium text-on-surface">Texture Density Analysis</p>
                  <p className="text-sm text-on-surface-variant mt-2">
                    Wrinkle scoring is calculated via dynamic edge-detection algorithms (Sobel filters) localized to high-stress facial regions, yielding a purely mathematical quantification of skin elasticity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative p-12 md:p-16 rounded-[40px] bg-surface-container-lowest shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex flex-shrink-0 items-center justify-center text-secondary">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-secondary rounded-full"></div>
                  <h2 className="text-3xl font-bold">Clinical Precision</h2>
                </div>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  Every weight and bias in our model has been calibrated against a dataset exceeding 5,000,000 clinical skin assessments. This ensures our AI interprets diverse skin tones and ages without built-in biases, matching the diagnostic rigor of human professionals.
                </p>
              </div>
            </div>
          </section>

          <section className="relative p-12 md:p-16 flex flex-col md:flex-row gap-12 items-start items-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex flex-shrink-0 items-center justify-center text-primary">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Neural Privacy Architecture</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We believe health data must remain sovereign. The AgeVision model weights are downloaded securely to your browser cache. Zero inference occurs on our servers; every line of analysis is executed strictly by your device&apos;s local processor.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
