import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { GenerateTripRequestSchema, ItinerarySchema } from "@/lib/trip-builder";

const PARTY_SIZE_LABELS = {
  solo: { en: "Solo traveler", zh: "單獨旅行" },
  couple: { en: "Couple", zh: "兩人同行" },
  family: { en: "Family with kids", zh: "親子家庭" },
} as const;

const INTEREST_LABELS = {
  tea: { en: "Tea culture & mountain aesthetics", zh: "茶文化與山林美學" },
  heritage: { en: "Old street & historical architecture", zh: "老街與歷史建築" },
  nature: { en: "Nature hiking & waterfalls", zh: "自然健行與瀑布" },
} as const;

const PACE_LABELS = {
  easy: { en: "Easy pace", zh: "步調輕鬆" },
  moderate: { en: "Moderate pace", zh: "步調適中" },
  active: { en: "Active pace", zh: "步調活躍" },
} as const;

const SPECIAL_NEED_LABELS = {
  accessible: { en: "Wheelchair / mobility accessible", zh: "需要無障礙設施" },
  vegetarian: { en: "Vegetarian meals", zh: "需要素食餐點" },
} as const;

const client = new Anthropic();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = GenerateTripRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { lang, partySize, interests, pace, specialNeeds, notes } = parsed.data;

  const languageName = lang === "zh" ? "Traditional Chinese (繁體中文)" : "English";
  const interestList = interests
    .map((key) => INTEREST_LABELS[key][lang])
    .join(", ");
  const specialNeedsList = specialNeeds.length
    ? specialNeeds.map((key) => SPECIAL_NEED_LABELS[key][lang]).join(", ")
    : lang === "zh"
      ? "無"
      : "None";

  const preferenceLines = [
    `Party: ${PARTY_SIZE_LABELS[partySize][lang]}`,
    `Interests: ${interestList}`,
    `Preferred pace: ${PACE_LABELS[pace][lang]}`,
    `Special requirements: ${specialNeedsList}`,
    notes.trim() ? `Additional notes from traveler: ${notes.trim()}` : null,
  ].filter(Boolean);

  const userPrompt = `Design one bespoke, private one-day Taiwan day tour for this traveler:\n\n${preferenceLines.join(
    "\n"
  )}\n\nStructure the day into morning, afternoon, and evening stops.`;

  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 4096,
      output_config: {
        format: zodOutputFormat(ItinerarySchema),
        effort: "low",
      },
      system: `You are the AI trip concierge for "Taiwan Local Host", a boutique day-tour company. Design a realistic, specific one-day itinerary in and around Taiwan that matches the traveler's stated interests, pace, and special requirements. Ground every stop in a real, named Taiwan location, dish, or cultural detail — never generic filler. Respond entirely in ${languageName}, including all titles and descriptions.`,
      messages: [{ role: "user", content: userPrompt }],
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "The AI response could not be parsed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(response.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("generate-trip: Anthropic authentication error", error);
      return NextResponse.json(
        { error: "The AI service is not configured correctly." },
        { status: 500 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Too many requests right now. Please try again shortly." },
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.APIConnectionError) {
      return NextResponse.json(
        { error: "Could not reach the AI service. Please try again." },
        { status: 502 }
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("generate-trip: Anthropic API error", error);
      return NextResponse.json(
        { error: "The AI service returned an error. Please try again." },
        { status: 502 }
      );
    }
    console.error("generate-trip: unexpected error", error);
    return NextResponse.json(
      { error: "Unexpected error generating your itinerary." },
      { status: 500 }
    );
  }
}
