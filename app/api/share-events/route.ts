import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const eventSchema = z.object({ contentItemId: z.string().min(1).max(200), eventType: z.enum(["view", "caption_copy", "media_download", "share"]) });
export async function POST(request: Request) {
  const result = eventSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Invalid share event" }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from("share_events").insert({ content_item_id: result.data.contentItemId, event_type: result.data.eventType });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ accepted: true }, { status: 201 });
}
