"use client";

import { useState } from "react";

async function track(contentItemId: string, eventType: string) {
  try { await fetch("/api/share-events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentItemId, eventType }) }); } catch { /* Sharing must still work when analytics is unavailable. */ }
}

export function ShareActions({ id, title, caption }: { id: string; title: string; caption: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(caption); setCopied(true); void track(id, "caption_copy"); window.setTimeout(() => setCopied(false), 1800); }
  async function share() {
    void track(id, "share");
    if (navigator.share) await navigator.share({ title, text: caption, url: window.location.href });
    else { await navigator.clipboard.writeText(`${caption}\n${window.location.href}`); setCopied(true); }
  }
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex">
      <button onClick={copy} className="min-h-11 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-strong">{copied ? "Copied!" : "Copy caption"}</button>
      <button onClick={share} className="min-h-11 rounded-xl border bg-white px-4 text-sm font-semibold hover:bg-surface-muted">Share</button>
    </div>
  );
}
