"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// this defers loading the entire Three.js/R3F bundle until this component
// actually renders — not bundled into the initial page load at all.
const ActivityOrb = dynamic(() => import("../../components/ActivityOrb"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-500 text-sm">Loading 3D scene…</p>
    </div>
  ),
});

export default function OrbDemoPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center max-w-md">
        <h1 className="text-zinc-100 text-xl font-semibold mb-2">
          Activity Orb
        </h1>
        <p className="text-zinc-500 text-sm">
          Click the shape to cycle colors, hover to see it react.
        </p>
      </div>

      {prefersReducedMotion ? (
        <div className="h-64 w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-violet-600" />
        </div>
      ) : (
        <div className="w-full max-w-md">
          <ActivityOrb />
        </div>
      )}
    </div>
  );
}
