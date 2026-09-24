"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import BookingForm from "@/components/booking-form";
import {
  PARTY_SIZE_KEYS,
  INTEREST_KEYS,
  PACE_KEYS,
  SPECIAL_NEED_KEYS,
  type PartySize,
  type Interest,
  type Pace,
  type SpecialNeed,
  type Itinerary,
  type GenerateTripRequest,
} from "@/lib/trip-builder";

type Dict = Awaited<ReturnType<typeof getDictionary>>;
type AITripBuilderDict = Dict["aiTripBuilder"];

function ToggleButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? "border-gold bg-gold text-forest-dark"
          : "border-cream/25 text-cream/80 hover:bg-cream/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function AITripBuilder({
  dict,
  lang,
}: {
  dict: AITripBuilderDict;
  lang: Locale;
}) {
  const [partySize, setPartySize] = useState<PartySize | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [pace, setPace] = useState<Pace>("easy");
  const [specialNeeds, setSpecialNeeds] = useState<SpecialNeed[]>([]);
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % dict.loadingSteps.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [loading, dict.loadingSteps.length]);

  function toggleInterest(key: Interest) {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function toggleSpecialNeed(key: SpecialNeed) {
    setSpecialNeeds((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (!partySize || interests.length === 0) {
      setValidationError(dict.validation);
      return;
    }
    setValidationError(null);
    setRequestError(null);
    setLoadingStepIndex(0);
    setLoading(true);

    const payload: GenerateTripRequest = {
      lang,
      partySize,
      interests,
      pace,
      specialNeeds,
      notes,
    };

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setRequestError(dict.errorGeneric);
        return;
      }

      const data = (await response.json()) as Itinerary;
      setItinerary(data);
    } catch {
      setRequestError(dict.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  function handleStartOver() {
    setItinerary(null);
    setRequestError(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-cream/15 bg-cream/5 p-8 py-16 text-center sm:p-10 sm:py-20">
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-cream/20 border-t-gold"
        />
        <p className="mt-6 font-display text-xl font-medium text-cream">
          {dict.loading}
        </p>
        <p className="mt-2 text-sm text-cream/60">
          {dict.loadingSteps[loadingStepIndex]}
        </p>
      </div>
    );
  }

  if (itinerary) {
    const periods: { key: "morning" | "afternoon" | "evening"; stops: Itinerary["morning"] }[] = [
      { key: "morning", stops: itinerary.morning },
      { key: "afternoon", stops: itinerary.afternoon },
      { key: "evening", stops: itinerary.evening },
    ];

    return (
      <div className="rounded-3xl border border-cream/15 bg-cream/5 p-8 sm:p-10">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
          {dict.resultKicker}
        </span>
        <h3 className="mt-3 font-display text-2xl font-medium text-cream sm:text-3xl">
          {itinerary.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-cream/70">
          {itinerary.summary}
        </p>

        <div className="mt-8 space-y-8">
          {periods.map((period) => (
            <div key={period.key}>
              <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
                {dict.periods[period.key]}
              </h4>
              <div className="mt-3 space-y-4 border-l border-cream/15 pl-5">
                {period.stops.map((stop, index) => (
                  <div key={index}>
                    <p className="text-xs font-medium text-cream/50">{stop.time}</p>
                    <p className="mt-1 font-display text-lg font-medium text-cream">
                      {stop.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-cream/70">
                      {stop.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <BookingForm
            dict={dict.bookingForm}
            itinerary={itinerary}
            partySize={partySize as PartySize}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#"
            className="text-sm font-medium text-cream/70 underline underline-offset-4 transition-colors hover:text-gold"
          >
            {dict.contactCta}
          </a>
          <button
            type="button"
            onClick={handleStartOver}
            className="text-sm font-medium text-cream/70 underline underline-offset-4 transition-colors hover:text-gold sm:ml-auto"
          >
            {dict.startOver}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-cream/15 bg-cream/5 p-8 sm:p-10"
    >
      <fieldset>
        <legend className="text-sm font-medium text-cream">
          {dict.partySize.label}
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {PARTY_SIZE_KEYS.map((key) => (
            <ToggleButton
              key={key}
              selected={partySize === key}
              onClick={() => setPartySize(key)}
            >
              {dict.partySize.options[key]}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-cream">
          {dict.interests.label}{" "}
          <span className="text-cream/50">({dict.interests.helper})</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {INTEREST_KEYS.map((key) => (
            <ToggleButton
              key={key}
              selected={interests.includes(key)}
              onClick={() => toggleInterest(key)}
            >
              {dict.interests.options[key]}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-cream">
          {dict.pace.label}
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {PACE_KEYS.map((key) => (
            <ToggleButton
              key={key}
              selected={pace === key}
              onClick={() => setPace(key)}
            >
              {dict.pace.options[key]}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-cream">
          {dict.specialNeeds.label}
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {SPECIAL_NEED_KEYS.map((key) => (
            <ToggleButton
              key={key}
              selected={specialNeeds.includes(key)}
              onClick={() => toggleSpecialNeed(key)}
            >
              {dict.specialNeeds.options[key]}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <div className="mt-8">
        <label htmlFor="trip-notes" className="text-sm font-medium text-cream">
          {dict.notes.label}
        </label>
        <textarea
          id="trip-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={dict.notes.placeholder}
          rows={3}
          className="mt-3 w-full rounded-2xl border border-cream/20 bg-cream/5 p-4 text-[15px] text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
        />
      </div>

      {validationError && (
        <p className="mt-6 text-sm text-terracotta">{validationError}</p>
      )}
      {requestError && <p className="mt-6 text-sm text-terracotta">{requestError}</p>}

      <button
        type="submit"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[15px] font-medium text-forest-dark transition-transform hover:-translate-y-0.5 hover:brightness-105"
      >
        {dict.submit}
      </button>
    </form>
  );
}
