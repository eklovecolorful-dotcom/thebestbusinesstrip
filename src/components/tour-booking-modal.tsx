"use client";

import { useState, type FormEvent } from "react";
import type { getDictionary, Locale } from "@/app/[lang]/dictionaries";

type Dict = Awaited<ReturnType<typeof getDictionary>>;
type TourBookingDict = Dict["tourBooking"];

const TODAY = new Date().toISOString().slice(0, 10);

export default function TourBookingModal({
  dict,
  lang,
  slug,
  tourTitle,
  price,
  onClose,
}: {
  dict: TourBookingDict;
  lang: Locale;
  slug: string;
  tourTitle: string;
  price: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
      const response = await fetch("/api/tour-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          lang,
          customerName: name.trim(),
          customerEmail: email.trim(),
          tourDate,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (!response.ok || !data?.url) {
        setError(data?.error ?? dict.errorGeneric);
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(dict.errorGeneric);
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-cream p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-terracotta">
              {dict.modalHeading}
            </p>
            <h3 className="mt-2 font-display text-xl font-medium text-charcoal">
              {tourTitle}
            </h3>
            <p className="mt-1 text-sm text-charcoal/60">
              {dict.priceLabel}: {price}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.close}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="tour-booking-name" className="text-sm font-medium text-charcoal">
              {dict.nameLabel}
            </label>
            <input
              id="tour-booking-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={dict.namePlaceholder}
              className="mt-2 w-full rounded-xl border border-charcoal/15 px-3.5 py-2.5 text-[15px] text-charcoal focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="tour-booking-email" className="text-sm font-medium text-charcoal">
              {dict.emailLabel}
            </label>
            <input
              id="tour-booking-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={dict.emailPlaceholder}
              className="mt-2 w-full rounded-xl border border-charcoal/15 px-3.5 py-2.5 text-[15px] text-charcoal focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="tour-booking-date" className="text-sm font-medium text-charcoal">
              {dict.tourDateLabel}
            </label>
            <input
              id="tour-booking-date"
              type="date"
              min={TODAY}
              value={tourDate}
              onChange={(event) => setTourDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-charcoal/15 px-3.5 py-2.5 text-[15px] text-charcoal focus:border-forest focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-terracotta">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? dict.submitting : dict.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
