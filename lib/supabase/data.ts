import "server-only";
import { createClient } from "@/lib/supabase/server";

export type IdeaRecord = {
  id: string;
  title: string;
  description: string;
  notes: string;
  status: string;
  campaignId: string;
  campaign: string;
  themeId: string | null;
  theme: string;
  owner: string;
  platforms: string[];
  updatedAt: string;
};

export type ContentRecord = {
  id: string;
  packageId: string;
  ideaId: string;
  title: string;
  body: string;
  caption: string;
  callToAction: string;
  status: string;
  type: string;
  theme: string;
  campaign: string;
  platforms: string[];
  updatedAt: string;
  comments: { id: string; body: string; author: string; createdAt: string }[];
};

type Named = { name: string };
type IdeaRow = { id: string; title: string; description: string; notes: string; status: string; campaign_id: string; theme_id: string | null; updated_at: string; campaigns: Named | Named[] | null; campaign_themes: Named | Named[] | null; profiles: { display_name: string } | { display_name: string }[] | null; idea_platforms: { platforms: Named | Named[] | null }[] };
type ContentRow = { id: string; package_id: string; title: string; body: string; caption: string; call_to_action: string; status: string; updated_at: string; content_types: Named | Named[] | null; campaign_themes: Named | Named[] | null; content_packages: { idea_id: string; ideas: { campaigns: Named | Named[] | null } | { campaigns: Named | Named[] | null }[] } | { idea_id: string; ideas: { campaigns: Named | Named[] | null } | { campaigns: Named | Named[] | null }[] }[]; content_platforms: { platforms: Named | Named[] | null }[]; review_comments?: { id: string; body: string; created_at: string; profiles: { display_name: string } | { display_name: string }[] | null }[] };

function one<T>(value: T | T[] | null): T | null { return Array.isArray(value) ? value[0] ?? null : value; }

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function getCurrentUser() {
  if (!configured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getIdeaOptions() {
  if (!configured()) return { campaigns: [], themes: [], platforms: [] };
  const supabase = await createClient();
  const [{ data: campaigns }, { data: themes }, { data: platforms }] = await Promise.all([
    supabase.from("campaigns").select("id,name").eq("is_active", true).order("starts_on"),
    supabase.from("campaign_themes").select("id,campaign_id,name").order("sort_order"),
    supabase.from("platforms").select("id,name").eq("is_active", true).order("sort_order"),
  ]);
  return { campaigns: campaigns ?? [], themes: themes ?? [], platforms: platforms ?? [] };
}

export async function getIdeas(): Promise<IdeaRecord[]> {
  if (!configured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("ideas").select("id,title,description,notes,status,campaign_id,theme_id,updated_at,campaigns(name),campaign_themes(name),profiles!ideas_owner_id_fkey(display_name),idea_platforms(platforms(name))").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as IdeaRow[]).map((row) => ({
    id: row.id, title: row.title, description: row.description, notes: row.notes, status: row.status,
    campaignId: row.campaign_id, campaign: one(row.campaigns)?.name ?? "Campaign",
    themeId: row.theme_id, theme: one(row.campaign_themes)?.name ?? "General",
    owner: one(row.profiles)?.display_name ?? "Bridge Team",
    platforms: row.idea_platforms.map((entry) => one(entry.platforms)?.name).filter((name): name is string => Boolean(name)),
    updatedAt: row.updated_at,
  }));
}

export async function getIdea(id: string) {
  return (await getIdeas()).find((idea) => idea.id === id) ?? null;
}

export async function getContentItems(status?: string): Promise<ContentRecord[]> {
  if (!configured()) return [];
  const supabase = await createClient();
  let query = supabase.from("content_items").select("id,package_id,title,body,caption,call_to_action,status,updated_at,content_types(name),campaign_themes(name),content_packages!inner(idea_id,ideas!inner(campaigns(name))),content_platforms(platforms(name)),review_comments(id,body,created_at,profiles!review_comments_created_by_fkey(display_name))").order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as ContentRow[]).map((row) => { const contentPackage = one(row.content_packages)!; const idea = one(contentPackage.ideas)!; return ({
    id: row.id, packageId: row.package_id, ideaId: contentPackage.idea_id,
    title: row.title, body: row.body, caption: row.caption, callToAction: row.call_to_action,
    status: row.status, type: one(row.content_types)?.name ?? "Content",
    theme: one(row.campaign_themes)?.name ?? "General",
    campaign: one(idea.campaigns)?.name ?? "Campaign",
    platforms: row.content_platforms.map((entry) => one(entry.platforms)?.name).filter((name): name is string => Boolean(name)),
    updatedAt: row.updated_at,
    comments: (row.review_comments ?? []).map((comment) => ({ id: comment.id, body: comment.body, author: one(comment.profiles)?.display_name ?? "Bridge Team", createdAt: comment.created_at })).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  }); });
}

export async function getContentItem(id: string) {
  return (await getContentItems()).find((item) => item.id === id) ?? null;
}

export async function getPublicShareItems(): Promise<ContentRecord[]> {
  if (!configured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_items").select("id,package_id,title,body,caption,call_to_action,status,updated_at,content_types(name),content_platforms(platforms(name))").eq("status", "ready_to_share").order("ready_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as (Omit<ContentRow, "content_packages" | "campaign_themes"> & { content_packages?: never; campaign_themes?: never })[]).map((row) => ({ id: row.id, packageId: row.package_id, ideaId: "", title: row.title, body: row.body, caption: row.caption, callToAction: row.call_to_action, status: row.status, type: one(row.content_types)?.name ?? "Content", theme: "Bridge", campaign: "Bridge Fall 2026", platforms: row.content_platforms.map((entry) => one(entry.platforms)?.name).filter((name): name is string => Boolean(name)), updatedAt: row.updated_at, comments: [] }));
}
