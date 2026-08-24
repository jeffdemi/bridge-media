import { z } from "zod";
export const developmentSchema = z.object({ hook: z.string(), headline: z.string(), facebookPost: z.string(), instagramCaption: z.string(), xPost: z.string(), reelScript: z.string(), tiktokScript: z.string(), storyCopy: z.string(), graphicText: z.string(), callToAction: z.string() });
