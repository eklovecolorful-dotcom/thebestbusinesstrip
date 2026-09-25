import { NextResponse } from "next/server";
import { z } from "zod";
import { FEATURED_TOURS } from "@/lib/tours";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { getSiteUrl, getStripeClient } from "@/lib/stripe";

const TourCheckoutRequestSchema = z.object({
  slug: z.string().min(1),
  lang: z.enum(["en", "zh"]),
  customerName: z.string().trim().min(1).max(200),
  customerEmail: z.email(),
  tourDate: z.iso.date(),
});

function parsePriceToCents(price: string): number {
  const match = price.match(/\d+/);
  return match ? Number(match[0]) * 100 : 0;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = TourCheckoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { slug, lang, customerName, customerEmail, tourDate } = parsed.data;

  const tour = FEATURED_TOURS.find((t) => t.slug === slug);
  if (!tour) {
    return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  }

  const amountCents = parsePriceToCents(tour.price);

  let supabase: ReturnType<typeof getSupabaseServerClient>;
  let stripe: ReturnType<typeof getStripeClient>;
  try {
    supabase = getSupabaseServerClient();
    stripe = getStripeClient();
  } catch (error) {
    console.error("tour-checkout: not configured", error);
    return NextResponse.json(
      { error: "Checkout is not available right now." },
      { status: 500 }
    );
  }

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_email: customerEmail,
      tour_date: tourDate,
      party_size: "unspecified",
      itinerary_details: {
        title: tour.title[lang],
        summary: `${tour.category[lang]} · ${tour.location[lang]}`,
        morning: [
          {
            time: tour.duration[lang],
            title: tour.title[lang],
            description: tour.highlight[lang],
          },
        ],
        afternoon: [],
        evening: [],
      },
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !order) {
    console.error("tour-checkout: insert failed", insertError);
    return NextResponse.json(
      { error: "Could not save your booking. Please try again." },
      { status: 502 }
    );
  }

  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    locale: "auto",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: tour.title[lang],
            description: `${tour.duration[lang]} · ${tour.location[lang]}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
    success_url: `${siteUrl}/${lang}?payment=success`,
    cancel_url: `${siteUrl}/${lang}?payment=cancelled`,
  });

  await supabase
    .from("orders")
    .update({
      stripe_checkout_session_id: session.id,
      deposit_amount_cents: amountCents,
    })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
