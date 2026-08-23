import Link from "next/link";
import { ShareActions } from "@/components/share/share-actions";
import type { shareItems } from "@/lib/demo-data";

type Item = (typeof shareItems)[number];
export function ShareCard({ item }: { item: Item }) {
  return (
    <article className="overflow-hidden rounded-3xl border bg-white shadow-[0_10px_35px_rgba(23,35,29,.06)]">
      <Link href={`/share/${item.id}`} className={`relative grid aspect-[4/3] place-items-center bg-gradient-to-br ${item.accent} p-8 text-center text-white`}>
        <span className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs font-medium backdrop-blur">{item.duration}</span>
        <span className="max-w-sm text-2xl font-semibold leading-tight sm:text-3xl">{item.title}</span>
        {item.type === "Video" && <span aria-hidden="true" className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-white text-lg text-brand shadow">▶</span>}
      </Link>
      <div className="space-y-4 p-5">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-brand">{item.theme}</p><h2 className="mt-1 text-xl font-semibold leading-snug">{item.title}</h2></div>
        <div className="flex flex-wrap gap-2">{item.platforms.map((platform) => <span key={platform} className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium">{platform}</span>)}</div>
        <ShareActions id={item.id} title={item.title} caption={item.caption} />
      </div>
    </article>
  );
}
