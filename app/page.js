"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// the shader hero pulls in Three.js/GLSL code, so it's lazy-loaded via next/dynamic, this keeps that weight out of the home page's initial bundle until it's actually needed, and ssr: false is required since WebGL only works in a real browser, not on the server.
const ShaderHero = dynamic(() => import("../components/ShaderHero"), {
  ssr: false, // it disables server-side rendering for a specific component
  loading: () => (
    <div className="h-screen w-full bg-gradient-to-b from-violet-500 to-zinc-950" />
  ),
});

// this is the home page, where a user searches a GitHub username and
// gets sent to that person's profile page for the full analysis.
export default function Home() {
  const [username, setUsername] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // checks the user's OS-level "reduce motion" accessibility setting.
    // if it's on, we skip the animated shader entirely in favor of a
    // static gradient using the same colors.
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ignore empty submissions, then navigate to that user's profile page
    if (!username.trim()) return;
    router.push(`/profile/${username.trim()}`);
  }

  return (
    // full-viewport hero, breaking out of any narrow container so the
    // shader genuinely fills the screen rather than sitting in a small box
    <div className="relative h-screen w-full overflow-hidden">
      {prefersReducedMotion ? (
        // static fallback, same violet-to-zinc gradient as the shader, just with no animation and no GPU cost at all
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500 to-zinc-950" />
      ) : (
        // the real animated shader — reacts to time and cursor position
        <div className="absolute inset-0">
          <ShaderHero />
        </div>
      )}

      {/* content sits on top of the shader, stacked with the search form first */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
            GitHub Analyzer
          </h1>
          <p className="mt-2 text-sm text-zinc-200 drop-shadow-lg sm:text-base">
            Search, compare, and explore GitHub profiles with AI-powered
            insights.
          </p>
        </div>

        {/* the actual search functionality — submitting navigates straight
      to /profile/[username], where the real data fetching happens */}
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <label htmlFor="username-search" className="sr-only">
            GitHub username
          </label>
          <input
            id="username-search"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a GitHub username…"
            className="flex-1 rounded border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 backdrop-blur"
          />
          <button
            type="submit"
            className="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
