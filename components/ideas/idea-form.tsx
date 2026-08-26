"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveIdea } from "@/app/actions";
import type { IdeaRecord } from "@/lib/supabase/data";

type Options = Awaited<ReturnType<typeof import("@/lib/supabase/data").getIdeaOptions>>;

export function IdeaForm({ options, idea }: { options: Options; idea?: IdeaRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [campaignId, setCampaignId] = useState(idea?.campaignId ?? options.campaigns[0]?.id ?? "");
  const relevantThemes = options.themes.filter((theme) => theme.campaign_id === campaignId);
  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        const result = await saveIdea({ id: idea?.id, title: String(formData.get("title")), description: String(formData.get("description")), notes: String(formData.get("notes")), campaignId, themeId: String(formData.get("themeId") || "") || null, platformIds: formData.getAll("platformIds").map(Number) });
        router.push(`/ideas/${result.id}`); router.refresh();
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save the idea."); }
    });
  }
  return <form action={submit} className="mt-8 space-y-5 rounded-2xl border bg-white p-6">
    <Field label="Title"><input className="field" name="title" required defaultValue={idea?.title} placeholder="Why would I go back to church?" /></Field>
    <Field label="Description"><textarea className="field min-h-32" name="description" required defaultValue={idea?.description} placeholder="What is the central question or invitation?" /></Field>
    <Field label="Notes"><textarea className="field min-h-24" name="notes" defaultValue={idea?.notes} placeholder="Context, quotes, or creative direction" /></Field>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Campaign"><select className="field" value={campaignId} onChange={(event) => setCampaignId(event.target.value)}>{options.campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></Field><Field label="Theme"><select className="field" name="themeId" defaultValue={idea?.themeId ?? relevantThemes[0]?.id}>{relevantThemes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select></Field></div>
    <fieldset><legend className="mb-2 text-sm font-semibold">Suggested platforms</legend><div className="flex flex-wrap gap-3">{options.platforms.map((platform) => <label key={platform.id} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><input type="checkbox" name="platformIds" value={platform.id} defaultChecked={!idea || idea.platforms.includes(platform.name)} />{platform.name}</label>)}</div></fieldset>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <div className="flex justify-end gap-3"><Link href={idea ? `/ideas/${idea.id}` : "/ideas"} className="rounded-xl border px-5 py-3 font-semibold">Cancel</Link><button disabled={pending || !campaignId} className="rounded-xl bg-brand px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save idea"}</button></div>
  </form>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}</label>; }
