import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="w-full max-w-md rounded-3xl border bg-surface p-8 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
        Bridge Media
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-3 leading-7 text-muted">
        Sign in to contribute ideas, develop content, and move approved assets into the Share Center.
      </p>
      <form className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-semibold">Email</span><input className="field" type="email" autoComplete="email" /></label><label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><input className="field" type="password" autoComplete="current-password" /></label><button type="button" className="min-h-11 w-full rounded-xl bg-brand px-5 font-semibold text-white">Sign in</button></form>
    </section>
  );
}
