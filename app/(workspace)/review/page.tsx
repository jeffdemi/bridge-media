import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { ideas } from "@/lib/demo-data";

export default function ReviewPage() {
  const reviewItems = ideas.filter((idea) => idea.status === "review");

  return <div className="space-y-7">
    <header>
      <p className="text-sm font-semibold text-brand">Approval</p>
      <h1 className="mt-1 text-3xl font-semibold">Review queue</h1>
      <p className="mt-2 text-muted">{reviewItems.length} Bridge examples are ready for human review. Open an item to inspect the idea and its suggested platforms.</p>
    </header>
    <div className="grid gap-4 lg:grid-cols-2">
      {reviewItems.map((idea) => <article key={idea.id} className="rounded-2xl border bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">{idea.theme}</p>
            <h2 className="mt-2 text-xl font-semibold">{idea.title}</h2>
          </div>
          <StatusBadge status="review" />
        </div>
        <p className="mt-3 leading-7 text-muted">{idea.description}</p>
        <p className="mt-4 text-sm text-muted">{idea.platforms.join(" · ")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/ideas/${idea.id}`} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Open for review</Link>
          <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Approve</button>
        </div>
      </article>)}
    </div>
  </div>;
}
