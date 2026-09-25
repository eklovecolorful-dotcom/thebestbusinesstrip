import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { DEPOSIT_AMOUNT_CENTS, getSiteUrl, getStripeClient } from "@/lib/stripe";

const CheckoutRequestSchema = z.object({
  orderId: z.uuid(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = CheckoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { orderId } = parsed.data;

  let supabase: ReturnType<typeof getSupabaseServerClient>;
  let stripe: ReturnType<typeof getStripeClient>;
  try {
    supabase = getSupabaseServerClient();
    stripe = getStripeClient();
  } catch (error) {
    console.error("checkout: not configured", error);
    return NextResponse.json(
      { error: "Checkout is not available right now." },
      { status: 500 }
    );
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, customer_email, tour_date, status, itinerary_details")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: `Order is already ${order.status}.` },
      { status: 409 }
    );
  }

  const itinerary = order.itinerary_details as { title?: string } | null;
  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    locale: "auto",
    customer_email: order.customer_email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: DEPOSIT_AMOUNT_CENTS,
          product_data: {
            name: `Booking Deposit — ${itinerary?.title ?? "Taiwan Local Host Day Trip"}`,
            description: `Deposit to lock in ${order.tour_date}. Balance settled with your local host.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
    success_url: `${siteUrl}/admin/orders?payment=success`,
    cancel_url: `${siteUrl}/admin/orders?payment=cancelled`,
  });

  await supabase
    .from("orders")
    .update({
      stripe_checkout_session_id: session.id,
      deposit_amount_cents: DEPOSIT_AMOUNT_CENTS,
    })
    .eq("id", orderId);

  return NextResponse.json({ url: session.url });
}
