"use client";

import { useState, useRef } from "react";

// this is a fake async action that randomly succeeds or fails after a short delay.
// the forceOutcome argument is only used for the demo buttons below, to force a success or error outcome.
function fakeAsyncAction(forceOutcome) {
  return new Promise((resolve, reject) => {
    // simulate a random delay between 1 and 2 seconds. it is a Promise that either resolve()s (success) or reject()s (failure) after a delay.
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const willSucceed = forceOutcome === "success" ? true
        : forceOutcome === "error" ? false
        : Math.random() > 0.2;
      willSucceed ? resolve() : reject();
    }, delay);
  });
}

export default function GenerateButton() {
  // idle | loading | success | error
  const [state, setState] = useState("idle");
  const timeoutRef = useRef(null);

  async function handleClick(forceOutcome) {
    if (state === "loading") return; // ignore clicks while already loading

    clearTimeout(timeoutRef.current); // cancel any pending reset-to-idle
    setState("loading");

    try {
      await fakeAsyncAction(forceOutcome);
      setState("success");
    } catch {
      setState("error");
    }

    // after showing success/error briefly, return to idle automatically
    timeoutRef.current = setTimeout(() => setState("idle"), 1800);
  }

  const isError = state === "error";
  const isSuccess = state === "success";
  const isLoading = state === "loading";

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => handleClick()}
        disabled={isLoading}
        aria-live="polite"
        aria-busy={isLoading}
        className={`
          relative flex items-center justify-center gap-2
          rounded-md px-5 py-2.5 text-sm font-medium text-white
          transition-[background-color,transform] duration-200 ease-out
          motion-reduce:transition-none
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400
          disabled:cursor-not-allowed
          ${isError ? "bg-red-600 motion-safe:animate-[shake_320ms_ease-in-out]" : ""}
          ${isSuccess ? "bg-emerald-600" : ""}
          ${!isError && !isSuccess ? "bg-violet-500 hover:bg-violet-400 active:scale-[0.97]" : ""}
        `}
      >
        {/* icon area — cross-fades and slides between spinner / check / idle icon */}
        <span className="relative h-4 w-4 flex items-center justify-center">
          <svg
            className={`absolute h-4 w-4 animate-spin transition-opacity duration-200 motion-reduce:animate-none ${isLoading ? "opacity-100" : "opacity-0"}`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <svg
            className={`absolute h-4 w-4 transition-all duration-200 ${isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        <span className="transition-opacity duration-150">
          {isLoading ? "Generating…" : isSuccess ? "Done" : isError ? "Retry" : "Generate Summary"}
        </span>
      </button>

      {/* demo-only controls to force each state on demand */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => handleClick("success")}
          className="rounded border border-zinc-700 px-2 py-1 text-zinc-400 hover:text-zinc-200"
        >
          Force success
        </button>
        <button
          onClick={() => handleClick("error")}
          className="rounded border border-zinc-700 px-2 py-1 text-zinc-400 hover:text-zinc-200"
        >
          Force error
        </button>
      </div>
    </div>
  );
}