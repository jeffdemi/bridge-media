"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addReviewComment, saveContent, transitionContent } from "@/app/actions";
import type { ContentRecord } from "@/lib/supabase/data";

export function ContentEditor({ item }: { item: ContentRecord }) {
  const router = useRouter(); const [pending, startTransition] = useTransition(); const [error, setError] = useState(""); const [comment, setComment] = useState("");
  function run(task: () => Promise<void>) { setError(""); startTransition(async () => { try { await task(); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : "The change could not be saved."); } }); }
  return <div className="space-y-6">
    <form action={(data) => run(() => saveContent(item.id, { title: String(data.get("title")), body: String(data.get("body")), caption: String(data.get("caption")), callToAction: String(data.get("callToAction")) }))} className="space-y-5 rounded-2xl border bg-white p-6">
      <label className="block"><span className="mb-2 block text-sm font-semibold">Title</span><input className="field" name="title" defaultValue={item.title} required /></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold">Content</span><textarea className="field min-h-48" name="body" defaultValue={item.body} /></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold">Caption</span><textarea className="field min-h-32" name="caption" defaultValue={item.caption} /></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold">Call to action</span><input className="field" name="callToAction" defaultValue={item.callToAction} /></label>
      <div className="flex flex-wrap justify-end gap-2"><button disabled={pending} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Save changes</button>{item.status === "draft" && <button type="button" disabled={pending} onClick={() => run(() => transitionContent(item.id, "review"))} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Move to Review</button>}{item.status === "review" && <><button type="button" disabled={pending} onClick={() => run(() => transitionContent(item.id, "draft"))} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Return to Draft</button><button type="button" disabled={pending} onClick={() => run(() => transitionContent(item.id, "approved"))} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Approve</button></>}{item.status === "approved" && <><button type="button" disabled={pending} onClick={() => run(() => transitionContent(item.id, "draft"))} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Return to Draft</button><button type="button" disabled={pending} onClick={() => run(() => transitionContent(item.id, "ready_to_share"))} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Ready to Share</button></>}</div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </form>
    {item.status === "review" && <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Review comments</h2><div className="mt-4 space-y-3">{item.comments.map((entry) => <article key={entry.id} className="rounded-xl bg-surface-muted p-4"><p className="leading-7">{entry.body}</p><p className="mt-2 text-xs text-muted">{entry.author}</p></article>)}{!item.comments.length && <p className="text-sm text-muted">No comments yet.</p>}</div><form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (comment.trim()) run(async () => { await addReviewComment(item.id, comment); setComment(""); }); }}><input className="field" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a review comment" aria-label="Review comment" /><button disabled={pending || !comment.trim()} className="rounded-xl bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">Comment</button></form></section>}
  </div>;
}
