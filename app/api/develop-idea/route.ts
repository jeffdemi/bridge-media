import { Output, generateText } from "ai";
import { z } from "zod";
import { BRIDGE_WRITING_GUIDANCE } from "@/lib/ai/guidance";
import { developmentSchema } from "@/lib/ai/schema";
export const maxDuration = 45;
const requestSchema = z.object({ title: z.string().min(3).max(200), description: z.string().min(10).max(5000) });
export async function POST(request: Request) { const input = requestSchema.safeParse(await request.json().catch(() => null)); if (!input.success) return Response.json({ error: "Invalid idea" }, { status: 400 }); const result = await generateText({ model: "openai/gpt-5.6-terra", output: Output.object({ schema: developmentSchema }), system: `You help a church media team develop editable social content. ${BRIDGE_WRITING_GUIDANCE.join(" ")} Never claim the content is approved or published.`, prompt: `Develop this Bridge Course idea. Title: ${input.data.title}\nDescription: ${input.data.description}` }); return Response.json(result.output); }
