import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("stripe webhook: missing signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("stripe webhook: signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const supabase = getSupabaseServerClient();
        const { error } = await supabase
          .from("orders")
          .update({
            status: "confirmed",
            deposit_paid_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (error) {
          console.error("stripe webhook: failed to update order", error);
        }
      } catch (error) {
        console.error("stripe webhook: supabase not configured", error);
      }
    } else {
      console.error("stripe webhook: checkout.session.completed missing orderId metadata");
    }
  }

  return NextResponse.json({ received: true });
}
