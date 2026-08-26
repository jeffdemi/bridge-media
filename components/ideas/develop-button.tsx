"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { developIdea } from "@/app/actions";
export function DevelopButton({ ideaId }: { ideaId: string }) { const router = useRouter(); const [pending, startTransition] = useTransition(); const [error, setError] = useState(""); return <div><button disabled={pending} onClick={() => startTransition(async () => { try { await developIdea(ideaId); router.push("/content"); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Development failed."); } })} className="mt-5 rounded-xl bg-brand px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Developing content…" : "Develop idea"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</div>; }
