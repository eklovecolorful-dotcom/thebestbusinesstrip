"use client";

import { useState } from "react";
import type { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import TourBookingModal from "@/components/tour-booking-modal";

type Dict = Awaited<ReturnType<typeof getDictionary>>;

export default function TourBookingTrigger({
  dict,
  lang,
  slug,
  tourTitle,
  price,
  buttonLabel,
}: {
  dict: Dict["tourBooking"];
  lang: Locale;
  slug: string;
  tourTitle: string;
  price: string;
  buttonLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream transition-colors group-hover:bg-forest-dark"
      >
        {buttonLabel}
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <TourBookingModal
          dict={dict}
          lang={lang}
          slug={slug}
          tourTitle={tourTitle}
          price={price}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
