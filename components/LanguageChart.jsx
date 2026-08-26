"use client";

import { useMemo } from "react";

const COLORS = [
  "#8b5cf6",
  "#10b981",
  "#f97316",
  "#3b82f6",
  "#ec4899",
  "#eab308",
];

export default function LanguageChart({ repos }) {
  const breakdown = useMemo(() => {
    const counts = {};
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
    return Object.entries(counts)
      .map(([language, count]) => ({
        language,
        count,
        pct: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [repos]);

  if (breakdown.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Languages</h2>
      <div className="space-y-2">
        {breakdown.map((item, i) => (
          <div key={item.language}>
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>{item.language}</span>
              <span>{item.count}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${item.pct}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
