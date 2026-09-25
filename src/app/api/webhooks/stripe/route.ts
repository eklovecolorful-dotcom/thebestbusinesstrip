import { NextResponse } from "next/server";
import { Resend } from "resend";
import type Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { getStripeClient } from "@/lib/stripe";
import { buildPaymentConfirmedEmail } from "@/lib/email-templates";
import type { Itinerary } from "@/lib/trip-builder";

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
        const { data: order, error } = await supabase
          .from("orders")
          .update({
            status: "confirmed",
            deposit_paid_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select("*")
          .single();

        if (error || !order) {
          console.error("stripe webhook: failed to update order", error);
        } else {
          await sendPaymentConfirmedEmail(order);
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

async function sendPaymentConfirmedEmail(order: {
  id: string;
  customer_name: string;
  customer_email: string;
  tour_date: string;
  party_size: string;
  itinerary_details: unknown;
  deposit_amount_cents: number | null;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    console.warn(
      "stripe webhook: RESEND_API_KEY or RESEND_FROM_EMAIL not set — skipping payment confirmation email"
    );
    return;
  }

  const resend = new Resend(resendApiKey);
  const { subject, html, text } = buildPaymentConfirmedEmail({
    orderId: order.id,
    customerName: order.customer_name,
    tourDate: order.tour_date,
    partySize: order.party_size,
    itinerary: order.itinerary_details as Itinerary,
    amountPaidCents: order.deposit_amount_cents ?? 0,
  });

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("stripe webhook: payment confirmation email failed to send", error);
  }
}
