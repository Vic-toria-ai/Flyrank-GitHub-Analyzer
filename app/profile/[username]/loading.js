export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 animate-pulse">
      <div className="h-24 rounded-lg border border-zinc-800 bg-zinc-900" />
      <div className="h-32 rounded-lg border border-zinc-800 bg-zinc-900" />
      <div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900" />
      <div className="h-64 rounded-lg border border-zinc-800 bg-zinc-900" />
    </div>
  );
}
