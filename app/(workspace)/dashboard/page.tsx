import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

const cards = [
  ["Ideas", "0"],
  ["Drafts", "0"],
  ["Ready", "0"],
  ["Scheduled", "0"],
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-brand">Bridge Fall 2026</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Campaign dashboard
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          Plan welcoming, conversational invitations for people exploring
          Christianity in and around Malvern.
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
        <PlaceholderCard title="Upcoming content" />
        <PlaceholderCard title="Recent results" />
      </section>
    </div>
  );
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <article className="min-h-56 rounded-2xl border bg-surface p-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-8 rounded-xl bg-surface-muted px-4 py-8 text-center text-sm text-muted">
        Campaign data will appear here after Phase 2 setup.
      </div>
    </article>
  );
}
