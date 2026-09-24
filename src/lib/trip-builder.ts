import { z } from "zod";

export const PARTY_SIZE_KEYS = ["solo", "couple", "family"] as const;
export const INTEREST_KEYS = ["tea", "heritage", "nature"] as const;
export const PACE_KEYS = ["easy", "moderate", "active"] as const;
export const SPECIAL_NEED_KEYS = ["accessible", "vegetarian"] as const;

export type PartySize = (typeof PARTY_SIZE_KEYS)[number];
export type Interest = (typeof INTEREST_KEYS)[number];
export type Pace = (typeof PACE_KEYS)[number];
export type SpecialNeed = (typeof SPECIAL_NEED_KEYS)[number];

export const GenerateTripRequestSchema = z.object({
  lang: z.enum(["en", "zh"]),
  partySize: z.enum(PARTY_SIZE_KEYS),
  interests: z.array(z.enum(INTEREST_KEYS)).min(1),
  pace: z.enum(PACE_KEYS),
  specialNeeds: z.array(z.enum(SPECIAL_NEED_KEYS)),
  notes: z.string().max(500).optional().default(""),
});
export type GenerateTripRequest = z.infer<typeof GenerateTripRequestSchema>;

export const ItineraryStopSchema = z.object({
  time: z
    .string()
    .describe("Approximate time or time range for this stop, e.g. '9:00 AM'"),
  title: z.string().describe("Short, appealing title for this activity"),
  description: z
    .string()
    .describe(
      "2-3 sentence description of the activity, grounded in a real, specific Taiwan location"
    ),
});
export type ItineraryStop = z.infer<typeof ItineraryStopSchema>;

export const ItinerarySchema = z.object({
  title: z.string().describe("A short, appealing title for the whole day trip"),
  summary: z.string().describe("A 1-2 sentence overview of the day"),
  morning: z.array(ItineraryStopSchema).min(1).max(2),
  afternoon: z.array(ItineraryStopSchema).min(1).max(2),
  evening: z.array(ItineraryStopSchema).min(1).max(2),
});
export type Itinerary = z.infer<typeof ItinerarySchema>;
