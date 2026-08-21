export function FoundationPage({ title, description, phase }: { title: string; description: string; phase: string }) {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-brand">Bridge Fall 2026</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">{description}</p>
      </header>
      <section className="rounded-2xl border bg-surface p-6 sm:p-8">
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-strong">Planned for {phase}</span>
        <h2 className="mt-5 text-xl font-semibold">Foundation ready</h2>
        <p className="mt-2 max-w-xl leading-7 text-muted">This route is part of the Phase 1 workspace shell. Its data-backed workflow will be added in the designated phase.</p>
      </section>
    </div>
  );
}
