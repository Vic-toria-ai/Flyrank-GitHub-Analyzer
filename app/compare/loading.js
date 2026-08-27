export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 animate-pulse">
      <div className="h-6 w-48 rounded bg-zinc-800" />
      <div className="h-10 w-full rounded bg-zinc-800" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="h-24 rounded-lg border border-zinc-800 bg-zinc-900" />
          <div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900" />
        </div>
        <div className="space-y-4">
          <div className="h-24 rounded-lg border border-zinc-800 bg-zinc-900" />
          <div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}