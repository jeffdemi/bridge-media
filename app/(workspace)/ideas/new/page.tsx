import Link from "next/link";
import { IdeaForm } from "@/components/ideas/idea-form";
import { getIdeaOptions } from "@/lib/supabase/data";
export default async function NewIdeaPage() { const options = await getIdeaOptions(); return <div className="mx-auto max-w-3xl"><Link href="/ideas" className="text-sm font-semibold text-brand">← Idea Bank</Link><h1 className="mt-4 text-3xl font-semibold">Capture a new idea</h1><p className="mt-2 text-muted">Start with the thought. Formats and assets come later.</p>{options.campaigns.length ? <IdeaForm options={options} /> : <p className="mt-8 rounded-2xl border bg-white p-6 text-muted">Connect Supabase and sign in to create ideas.</p>}</div>; }
