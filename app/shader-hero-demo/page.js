"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ShaderHero = dynamic(() => import("../../components/ShaderHero"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full rounded-lg border border-zinc-800 bg-gradient-to-b from-violet-500 to-zinc-950 flex items-center justify-center">
      <p className="text-zinc-200 text-sm">Loading shader…</p>
    </div>
  ),
});

export default function ShaderHeroDemoPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
      {prefersReducedMotion ? (
        // static gradient fallback — same palette, no animation, no GPU cost
        <div className="relative h-72 w-full max-w-2xl overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-b from-violet-500 to-zinc-950">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              GitHub Analyzer
            </h1>
            <p className="text-sm text-zinc-200 drop-shadow-lg mt-1">
              Understand any developer's activity at a glance.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <ShaderHero />
        </div>
      )}
    </div>
  );
}