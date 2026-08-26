import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/content/content-editor";
import { StatusBadge } from "@/components/ui/status-badge";
import { getContentItem } from "@/lib/supabase/data";
export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const item = await getContentItem(id); if (!item) notFound(); return <div className="space-y-6"><Link href="/content" className="text-sm font-semibold text-brand">← Content packages</Link><header><div className="flex items-center gap-3"><span className="text-sm font-semibold text-brand">{item.type} · {item.theme}</span><StatusBadge status={item.status as never} /></div><h1 className="mt-3 text-3xl font-semibold">{item.title}</h1><p className="mt-2 text-muted">{item.platforms.join(" · ")}</p></header><ContentEditor item={item} /></div>; }
