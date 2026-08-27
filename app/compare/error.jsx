"use client";

export default function Error({ error, reset }) {
  return (
    <div className="p-6">
      <div className="rounded-md border border-red-900 bg-red-950/40 p-4 max-w-md">
        <p className="text-red-300 text-sm mb-3">
          Something went wrong loading this comparison. Check that both usernames exist.
        </p>
        <button
          onClick={reset}
          className="rounded bg-red-800 px-3 py-1.5 text-sm text-red-100 hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}