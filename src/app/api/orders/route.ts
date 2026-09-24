import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { buildBookingConfirmationEmail } from "@/lib/email-templates";
import { ItinerarySchema, PARTY_SIZE_KEYS } from "@/lib/trip-builder";

const OrderRequestSchema = z.object({
  customerName: z.string().trim().min(1).max(200),
  customerEmail: z.email(),
  tourDate: z.iso.date(),
  partySize: z.enum(PARTY_SIZE_KEYS),
  itinerary: ItinerarySchema,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = OrderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { customerName, customerEmail, tourDate, partySize, itinerary } =
    parsed.data;

  let supabase: ReturnType<typeof getSupabaseServerClient>;
  try {
    supabase = getSupabaseServerClient();
  } catch (error) {
    console.error("orders: Supabase not configured", error);
    return NextResponse.json(
      { error: "Booking is not available right now. Please try again later." },
      { status: 500 }
    );
  }

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_email: customerEmail,
      tour_date: tourDate,
      party_size: partySize,
      itinerary_details: itinerary,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !order) {
    console.error("orders: insert failed", insertError);
    return NextResponse.json(
      { error: "Could not save your booking. Please try again." },
      { status: 502 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (resendApiKey && fromEmail) {
    const resend = new Resend(resendApiKey);
    const { subject, html, text } = buildBookingConfirmationEmail({
      orderId: order.id,
      customerName,
      tourDate,
      partySize,
      itinerary,
    });

    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject,
      html,
      text,
    });

    if (emailError) {
      console.error("orders: confirmation email failed to send", emailError);
    }
  } else {
    console.warn(
      "orders: RESEND_API_KEY or RESEND_FROM_EMAIL not set — skipping confirmation email"
    );
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
