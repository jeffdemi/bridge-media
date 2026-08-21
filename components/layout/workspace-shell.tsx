import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  ["Dashboard", "/dashboard"],
  ["Campaigns", "/campaigns"],
  ["Calendar", "/calendar"],
  ["Content", "/content"],
  ["Media", "/media"],
  ["Results", "/results"],
] as const;

export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r bg-surface px-5 py-7 lg:flex lg:flex-col">
        <Brand />
        <nav aria-label="Workspace" className="mt-10 space-y-1">
          {navigation.map(([label, href]) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </nav>
        <p className="mt-auto rounded-xl bg-brand-soft p-4 text-sm leading-6 text-brand-strong">
          Scheduling is for team planning only. Bridge Media never publishes
          automatically.
        </p>
      </aside>

      <div className="min-w-0">
        <header className="border-b bg-surface px-4 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="lg:hidden"><Brand /></div>
            <p className="hidden text-sm text-muted sm:block">Valley Creek Church · Malvern, PA</p>
            <details className="relative lg:hidden">
              <summary className="cursor-pointer list-none rounded-lg border px-3 py-2 text-sm font-semibold">Menu</summary>
              <nav aria-label="Mobile workspace" className="absolute right-0 z-10 mt-2 w-56 rounded-xl border bg-surface p-2 shadow-lg">
                {navigation.map(([label, href]) => <NavLink key={href} href={href} label={label} />)}
              </nav>
            </details>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="inline-flex items-center gap-3 font-semibold tracking-tight">
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-brand text-lg text-white">B</span>
      <span>Bridge Media</span>
    </Link>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="block rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-surface-muted hover:text-brand-strong">{label}</Link>;
}
