import Link from "next/link";
import { ArrowLeft, Lock, ServerOff, Fingerprint, Scale } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/20">
      <div className="container mx-auto px-6 pt-12 pb-24 max-w-3xl">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider hover:text-primary-container transition-colors mb-16">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Terminal
        </Link>

        {/* Hero Section */}
        <div className="mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary-container/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            Privacy by Design:<br />
            <span className="text-on-surface-variant italic font-normal">Your Data, Your Device.</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            We are redefining biometric analysis by removing the cloud from the equation. Your facial data is sensitive medical information, and we treat it with absolute mathematical sovereignty.
          </p>
        </div>

        {/* Core Principles */}
        <div className="space-y-12">
          
          <div className="flex gap-6 group">
            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
              <ServerOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Zero-Cloud Uploads</h3>
              <p className="text-on-surface-variant leading-relaxed">
                When you use Skinlytics AgeVision AI, your photos are never uploaded, transmitted, or saved to any external server. The analysis is performed strictly within the sandbox of your active web browser.
              </p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Local-Only Processing</h3>
              <p className="text-on-surface-variant leading-relaxed">
                The neural network models required for analysis are securely downloaded to your device once. From that moment, your device&apos;s CPU/GPU executes the algorithms independently, ensuring an airtight data environment.
              </p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Neural Enclave Security</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Facial landmarks and wrinkle topology maps exist only for the milliseconds required to compute your score. Once the analysis is complete, this temporary biometric signature is permanently wiped from memory.
              </p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Your Rights</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Because we collect exactly zero personal information, there is no Account Deletion or Data Access Request needed. Your data is yours. If you wish to clear the AI models from your cache, simply clear your browser&apos;s site data.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-24 pt-10 border-t border-surface-container-highest text-center">
          <p className="text-sm text-on-surface-variant mb-6">Questions regarding our security architecture?</p>
          <button className="bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface font-bold py-3 px-8 rounded-full text-sm">
            Contact Security Team
          </button>
        </div>
      </div>
    </div>
  );
}
