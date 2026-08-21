import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="w-full max-w-md rounded-3xl border bg-surface p-8 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
        Bridge Media
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-3 leading-7 text-muted">
        Supabase sign-in will be enabled in Phase 2. The workspace foundation is
        available now for review.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 font-semibold text-white transition hover:bg-brand-strong"
      >
        Preview workspace
      </Link>
    </section>
  );
}
