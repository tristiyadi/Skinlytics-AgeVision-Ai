/**
 * Before/After Image Comparison Component
 * An interactive slider that reveals the simulated image overtop the original.
 */
"use client";

import { useState, useRef, useCallback } from "react";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: BeforeAfterProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square rounded-3xl overflow-hidden cursor-col-resize select-none shadow-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* After (bottom layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />

      {/* Before (clipped layer) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: "none" }}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary/40">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
            <path d="M5 3L2 8L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L14 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider z-20">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider z-20">
        {afterLabel}
      </div>
    </div>
  );
}
