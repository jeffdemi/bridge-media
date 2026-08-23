"use client";

import { useState } from "react";
import { ShareCard } from "@/components/share/share-card";
import { shareItems } from "@/lib/demo-data";

export function ShareCenter() {
  const [filter, setFilter] = useState("Latest");
  const filters = ["Latest", "Instagram", "Facebook", "TikTok", "Questions", "Invitations"];
  const visible = filter === "Latest" ? shareItems : shareItems.filter((i) => i.platforms.includes(filter as never) || i.theme === filter);
  return <><div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">{filters.map((value) => <button key={value} onClick={() => setFilter(value)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${filter === value ? "bg-brand text-white" : "border bg-white"}`}>{value}</button>)}</div><div className="mt-7 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">{visible.map((item) => <ShareCard key={item.id} item={item} />)}</div></>;
}
