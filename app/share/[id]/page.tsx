import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareActions } from "@/components/share/share-actions";
import { shareItems } from "@/lib/demo-data";

export default async function ShareDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const item = shareItems.find((entry) => entry.id === id); if (!item) notFound();
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:py-12"><Link href="/" className="text-sm font-semibold text-brand">← Back to Share Center</Link><article className="mt-5 overflow-hidden rounded-3xl border bg-white"><div className={`grid aspect-video place-items-center bg-gradient-to-br ${item.accent} p-8 text-center text-3xl font-semibold text-white sm:text-5xl`}>{item.title}</div><div className="space-y-5 p-6 sm:p-8"><div className="flex flex-wrap gap-2">{item.platforms.map((p) => <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold" key={p}>{p}</span>)}</div><h1 className="text-3xl font-semibold">{item.title}</h1><p className="rounded-2xl bg-surface-muted p-5 leading-7">{item.caption}</p><ShareActions id={item.id} title={item.title} caption={item.caption} /></div></article></main>;
}
