import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

const cards = [
  ["Ideas", "12"],
  ["Developing", "4"],
  ["In review", "3"],
  ["Ready to share", "8"],
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-brand">Bridge Fall 2026</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Workshop dashboard
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          Move the strongest ideas toward useful media people can confidently share.
        </p>
      </header>

      <section aria-labelledby="content-overview">
        <h2 id="content-overview" className="text-lg font-semibold">
          Content overview
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value]) => (
            <article key={label} className="rounded-2xl border bg-surface p-5">
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <QuickActions />
        <PlaceholderCard title="Needs attention" />
      </section>
    </div>
  );
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <article className="min-h-56 rounded-2xl border bg-surface p-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-8 rounded-xl bg-surface-muted px-4 py-8 text-center text-sm text-muted">
        “Why does God allow suffering?” is waiting for review. Two drafts have no owner.
      </div>
    </article>
  );
}

function QuickActions() {
  const actions = [["New idea", "/ideas/new"], ["Develop idea", "/ideas"], ["Upload media", "/media"], ["Review content", "/review"], ["Open Share Center", "/"]] as const;
  return <article className="rounded-2xl border bg-surface p-6"><h2 className="font-semibold">Quick actions</h2><div className="mt-5 grid grid-cols-2 gap-3">{actions.map(([label, href]) => <a key={href + label} href={href} className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-surface-muted">{label}</a>)}</div></article>;
}
