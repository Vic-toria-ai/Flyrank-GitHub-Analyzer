"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// a small form collecting two usernames, then navigating to /compare?a=...&b=... so the page itself can fetch both server-side
export default function CompareForm({ defaultA, defaultB }) {
  const [userA, setUserA] = useState(defaultA || "");
  const [userB, setUserB] = useState(defaultB || "");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    if (!userA.trim() || !userB.trim()) return;
    router.push(`/compare?a=${userA.trim()}&b=${userB.trim()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor="user-a" className="block text-xs text-zinc-400 mb-1">
          First username
        </label>
        <input
          id="user-a"
          value={userA}
          onChange={(e) => setUserA(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="user-b" className="block text-xs text-zinc-400 mb-1">
          Second username
        </label>
        <input
          id="user-b"
          value={userB}
          onChange={(e) => setUserB(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500"
      >
        Compare
      </button>
    </form>
  );
}