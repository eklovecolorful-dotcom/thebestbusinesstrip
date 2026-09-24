import "server-only";
import Stripe from "stripe";

// Flat deposit to lock in a date; the remainder is settled with the host later.
// Override with DEPOSIT_AMOUNT_USD (whole dollars) if $50 isn't the right default.
export const DEPOSIT_AMOUNT_USD = Number(process.env.DEPOSIT_AMOUNT_USD ?? "50");
export const DEPOSIT_AMOUNT_CENTS = Math.round(DEPOSIT_AMOUNT_USD * 100);

let client: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured: set STRIPE_SECRET_KEY.");
  }

  client = new Stripe(secretKey);
  return client;
}

export function getSiteUrl(): string {
  return process.env.SITE_URL ?? "http://localhost:3000";
}
