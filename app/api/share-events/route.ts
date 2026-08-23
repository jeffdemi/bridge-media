import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({ contentItemId: z.string().min(1).max(200), eventType: z.enum(["view", "caption_copy", "media_download", "share"]) });
export async function POST(request: Request) {
  const result = eventSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Invalid share event" }, { status: 400 });
  // The production Supabase adapter inserts this event after verifying the item is ready_to_share.
  return NextResponse.json({ accepted: true }, { status: 202 });
}
