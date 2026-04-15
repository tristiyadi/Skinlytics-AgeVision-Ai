/**
 * Shared Navigation Header for Feature Pages
 * Provides consistent back navigation and feature title across all pages.
 */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Scan } from "lucide-react";

interface FeatureHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backHref?: string;
}

export function FeatureHeader({ title, subtitle, badge, backHref = "/dashboard" }: FeatureHeaderProps) {
  return (
    <header className="flex items-center gap-4 mb-6">
      <Link href={backHref}>
        <Button variant="ghost" size="icon" className="rounded-full shrink-0">
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight truncate">{title}</h1>
          {badge && (
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest border-primary/30 text-primary bg-primary/5 shrink-0">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      <Link href="/scan" className="shrink-0">
        <Button variant="outline" size="sm" className="rounded-full gap-2">
          <Scan className="w-4 h-4" />
          <span className="hidden sm:inline">New Scan</span>
        </Button>
      </Link>
    </header>
  );
}
