import Link from "next/link";
import { ShareCenter } from "@/components/share/share-center";

export default function Home() {
  return <div className="min-h-screen bg-[#f7f5f0]"><header className="border-b bg-white/90"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"><Link href="/" className="flex items-center gap-3 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-brand text-white">B</span>Bridge Share Center</Link><Link href="/dashboard" className="text-sm font-semibold text-brand">Team workshop</Link></div></header><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.15em] text-brand">Bridge Fall 2026</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Ready to share.</h1><p className="mt-4 text-lg leading-8 text-muted">Choose something that speaks to you, then copy, download, or share it with someone in your world.</p></div><div className="mt-8"><ShareCenter /></div></main></div>;
}
