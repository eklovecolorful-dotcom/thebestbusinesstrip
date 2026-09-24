"use client";

import { useState, type FormEvent } from "react";
import type { getDictionary } from "@/app/[lang]/dictionaries";
import type { Itinerary, PartySize } from "@/lib/trip-builder";

type Dict = Awaited<ReturnType<typeof getDictionary>>;
type BookingFormDict = Dict["aiTripBuilder"]["bookingForm"];

const TODAY = new Date().toISOString().slice(0, 10);

export default function BookingForm({
  dict,
  itinerary,
  partySize,
}: {
  dict: BookingFormDict;
  itinerary: Itinerary;
  partySize: PartySize;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!name.trim() || !email.trim() || !tourDate) {
      setError(dict.validationError);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          tourDate,
          partySize,
          itinerary,
        }),
      });

      if (!response.ok) {
        setError(dict.errorGeneric);
        return;
      }

      setSubmittedEmail(email.trim());
    } catch {
      setError(dict.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedEmail) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6">
        <p className="font-display text-lg font-medium text-cream">
          {dict.successTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-cream/70">
          {dict.successMessage.replace("{email}", submittedEmail)}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cream/15 bg-forest-dark/40 p-6"
    >
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
        {dict.kicker}
      </span>
      <p className="mt-2 font-display text-lg font-medium text-cream">
        {dict.heading}
      </p>
      <p className="mt-1 text-sm text-cream/60">{dict.subheading}</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="booking-name" className="text-xs font-medium text-cream/80">
            {dict.nameLabel}
          </label>
          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={dict.namePlaceholder}
            className="mt-2 w-full rounded-xl border border-cream/20 bg-cream/5 px-3.5 py-2.5 text-[15px] text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="booking-email" className="text-xs font-medium text-cream/80">
            {dict.emailLabel}
          </label>
          <input
            id="booking-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={dict.emailPlaceholder}
            className="mt-2 w-full rounded-xl border border-cream/20 bg-cream/5 px-3.5 py-2.5 text-[15px] text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="booking-date" className="text-xs font-medium text-cream/80">
            {dict.tourDateLabel}
          </label>
          <input
            id="booking-date"
            type="date"
            min={TODAY}
            value={tourDate}
            onChange={(event) => setTourDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-cream/20 bg-cream/5 px-3.5 py-2.5 text-[15px] text-cream focus:border-gold focus:outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-medium text-forest-dark transition-transform hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting ? dict.submitting : dict.submit}
      </button>
    </form>
  );
}
