import Link from "next/link"
import TokenWidget from "./TokenWidget"

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 py-3 flex items-center justify-between">
      <nav className="flex items-center gap-4">
        <Link href="/" className="text-sm font-semibold text-zinc-100">
          GitHub Analyzer
        </Link>
        <Link href="/compare" className="text-sm text-zinc-400 hover:text-zinc-200">
          Compare
        </Link>
      </nav>
      <TokenWidget />
    </header>
  );
}

