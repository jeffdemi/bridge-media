"use server";

import { Output, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BRIDGE_WRITING_GUIDANCE } from "@/lib/ai/guidance";
import { developmentSchema } from "@/lib/ai/schema";
import { createClient } from "@/lib/supabase/server";

const ideaSchema = z.object({ title: z.string().trim().min(3).max(200), description: z.string().trim().min(10).max(5000), notes: z.string().trim().max(5000), campaignId: z.string().uuid(), themeId: z.string().uuid().nullable(), platformIds: z.array(z.coerce.number().int().positive()).min(1) });
const contentSchema = z.object({ title: z.string().trim().min(1).max(200), body: z.string().trim().max(10000), caption: z.string().trim().max(5000), callToAction: z.string().trim().max(1000) });

async function authenticated() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must sign in to make changes.");
  return { supabase, user };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/login?error=Enter+a+valid+email+and+password");
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}

export async function saveIdea(input: z.input<typeof ideaSchema> & { id?: string }) {
  const values = ideaSchema.parse(input);
  const { supabase, user } = await authenticated();
  let id = input.id;
  if (id) {
    const { error } = await supabase.from("ideas").update({ title: values.title, description: values.description, notes: values.notes, campaign_id: values.campaignId, theme_id: values.themeId }).eq("id", id);
    if (error) throw new Error(error.message);
    await supabase.from("idea_platforms").delete().eq("idea_id", id);
  } else {
    const { data, error } = await supabase.from("ideas").insert({ title: values.title, description: values.description, notes: values.notes, campaign_id: values.campaignId, theme_id: values.themeId, created_by: user.id, owner_id: user.id }).select("id").single();
    if (error) throw new Error(error.message);
    id = data.id;
  }
  const { error: platformError } = await supabase.from("idea_platforms").insert(values.platformIds.map((platformId) => ({ idea_id: id!, platform_id: platformId })));
  if (platformError) throw new Error(platformError.message);
  revalidatePath("/ideas");
  revalidatePath(`/ideas/${id}`);
  return { id };
}

export async function developIdea(ideaId: string) {
  const { supabase, user } = await authenticated();
  const { data: idea, error } = await supabase.from("ideas").select("id,title,description,theme_id,status,campaigns(name,message,selling_points,ai_guidance),idea_platforms(platform_id)").eq("id", ideaId).single();
  if (error) throw new Error(error.message);
  const campaign = Array.isArray(idea.campaigns) ? idea.campaigns[0] : idea.campaigns;
  if (!campaign) throw new Error("The idea campaign could not be loaded.");
  const rollbackStatus = idea.status === "developing" ? "idea" : idea.status;
  let packageId: string | null = null;
  try {
  const { error: developingError } = await supabase.from("ideas").update({ status: "developing" }).eq("id", ideaId);
  if (developingError) throw new Error(developingError.message);
  const { output } = await generateText({ model: openai("gpt-5.6"), output: Output.object({ schema: developmentSchema }), instructions: `You help a church media team develop editable social content. ${BRIDGE_WRITING_GUIDANCE.join(" ")} Never claim content is approved or published.`, prompt: `Campaign: ${campaign.name}. Message: ${campaign.message}. Details: ${campaign.selling_points.join(", ")}. Guidance: ${campaign.ai_guidance}. Idea: ${idea.title}. Description: ${idea.description}` });
  const { data: packageRow, error: packageError } = await supabase.from("content_packages").insert({ idea_id: ideaId, title: output.headline, description: output.hook, created_by: user.id }).select("id").single();
  if (packageError) throw new Error(packageError.message);
  packageId = packageRow.id;
  const types = [
    { key: "text", title: "Facebook post", body: output.facebookPost, caption: output.facebookPost },
    { key: "text", title: "Instagram caption", body: output.instagramCaption, caption: output.instagramCaption },
    { key: "video", title: "Reel script", body: output.reelScript, caption: output.instagramCaption },
    { key: "video", title: "TikTok script", body: output.tiktokScript, caption: output.tiktokScript },
    { key: "text", title: "X post", body: output.xPost, caption: output.xPost },
    { key: "image", title: output.graphicText, body: output.graphicText, caption: output.instagramCaption },
  ];
  const { data: contentTypes, error: typeError } = await supabase.from("content_types").select("id,key").in("key", ["text", "video", "image"]);
  if (typeError) throw new Error(typeError.message);
  const typeIds = new Map(contentTypes.map((type) => [type.key, type.id]));
  const { data: items, error: itemsError } = await supabase.from("content_items").insert(types.map((item) => ({ package_id: packageRow.id, content_type_id: typeIds.get(item.key)!, theme_id: idea.theme_id, title: item.title, body: item.body, caption: item.caption, call_to_action: output.callToAction, created_by: user.id }))).select("id");
  if (itemsError) throw new Error(itemsError.message);
  const platforms = idea.idea_platforms.map((entry) => entry.platform_id);
  if (platforms.length) {
    const { error: platformError } = await supabase.from("content_platforms").insert(items.flatMap((item) => platforms.map((platformId) => ({ content_item_id: item.id, platform_id: platformId }))));
    if (platformError) throw new Error(platformError.message);
  }
  const { error: draftError } = await supabase.from("ideas").update({ status: "draft" }).eq("id", ideaId);
  if (draftError) throw new Error(draftError.message);
  const history = idea.status === "developing" ? [{ idea_id: ideaId, from_status: "developing" as const, to_status: "draft" as const, changed_by: user.id }] : [{ idea_id: ideaId, from_status: idea.status, to_status: "developing" as const, changed_by: user.id }, { idea_id: ideaId, from_status: "developing" as const, to_status: "draft" as const, changed_by: user.id }];
  const { error: historyError } = await supabase.from("status_history").insert(history);
  if (historyError) throw new Error(historyError.message);
  revalidatePath("/ideas"); revalidatePath("/content");
  return { ok: true as const, packageId: packageRow.id };
  } catch (error) {
    console.error("[developIdea] generation failed", { ideaId, error });
    if (packageId) await supabase.from("content_packages").delete().eq("id", packageId);
    await supabase.from("ideas").update({ status: rollbackStatus }).eq("id", ideaId);
    revalidatePath("/ideas"); revalidatePath(`/ideas/${ideaId}`);
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    const userMessage = message.includes("api key") || message.includes("authentication") || message.includes("401")
      ? "OpenAI authentication failed. Ask an administrator to check the OpenAI API key."
      : message.includes("quota") || message.includes("billing") || message.includes("429")
        ? "OpenAI billing or usage limits blocked this request. Ask an administrator to check the OpenAI account."
        : "OpenAI could not develop this idea. Please try again.";
    return { ok: false as const, error: userMessage };
  }
}

export async function saveContent(id: string, input: z.input<typeof contentSchema>) {
  const values = contentSchema.parse(input);
  const { supabase } = await authenticated();
  const { error } = await supabase.from("content_items").update({ title: values.title, body: values.body, caption: values.caption, call_to_action: values.callToAction }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/content"); revalidatePath(`/content/${id}`); revalidatePath("/review");
}

export async function transitionContent(id: string, toStatus: "draft" | "review" | "approved" | "ready_to_share") {
  const { supabase, user } = await authenticated();
  const { data: item, error: readError } = await supabase.from("content_items").select("status").eq("id", id).single();
  if (readError) throw new Error(readError.message);
  const allowed: Record<string, string[]> = { draft: ["review"], review: ["draft", "approved"], approved: ["draft", "ready_to_share"], ready_to_share: ["draft"] };
  if (!allowed[item.status]?.includes(toStatus)) throw new Error(`Cannot move ${item.status} content to ${toStatus}.`);
  const approval = toStatus === "approved" ? { approved_by: user.id, approved_at: new Date().toISOString() } : toStatus === "draft" ? { approved_by: null, approved_at: null, ready_at: null } : {};
  const ready = toStatus === "ready_to_share" ? { ready_at: new Date().toISOString() } : {};
  const { error } = await supabase.from("content_items").update({ status: toStatus, ...approval, ...ready }).eq("id", id);
  if (error) throw new Error(error.message);
  await supabase.from("status_history").insert({ content_item_id: id, from_status: item.status, to_status: toStatus, changed_by: user.id });
  revalidatePath("/content"); revalidatePath(`/content/${id}`); revalidatePath("/review"); revalidatePath("/"); revalidatePath("/share");
}

export async function addReviewComment(id: string, body: string) {
  const value = z.string().trim().min(1).max(4000).parse(body);
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("review_comments").insert({ content_item_id: id, body: value, created_by: user.id });
  if (error) throw new Error(error.message);
  revalidatePath(`/content/${id}`); revalidatePath("/review");
}
