import Link from "next/link";
import { lang } from "next/root-params";
import type { Tour, TourTheme } from "@/lib/tours";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";

const THEME_STYLES: Record<
  TourTheme,
  { gradient: string; iconBg: string }
> = {
  tea: {
    gradient: "from-forest-light via-forest to-forest-dark",
    iconBg: "bg-cream/15",
  },
  heritage: {
    gradient: "from-terracotta via-[#9c4a24] to-charcoal",
    iconBg: "bg-cream/15",
  },
  nature: {
    gradient: "from-[#2f4d3a] via-forest-dark to-charcoal",
    iconBg: "bg-cream/15",
  },
};

function ThemeIcon({ theme }: { theme: TourTheme }) {
  if (theme === "tea") {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <path
          d="M17 4C10 9 8 15 12 22c2.5 4.3 8.5 4.3 11 0 4-7 2-13-6-18Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M17 10v18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (theme === "heritage") {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <path d="M6 15 17 6l11 9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M8 15v13h18V15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M14 28v-8h6v8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path
        d="M4 25 12 12l5 7 3-4 10 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="24" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default async function TourCard({ tour }: { tour: Tour }) {
  const currentLang = await lang();
  if (!hasLocale(currentLang)) notFound();
  const dict = await getDictionary();

  const styles = THEME_STYLES[tour.theme];
  const hostInitial = tour.hostName.replace("Host ", "").charAt(0);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/8 bg-white shadow-[0_1px_2px_rgba(32,28,22,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(32,28,22,0.18)]">
      <div
        className={`relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br ${styles.gradient}`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <span className="absolute left-5 top-5 rounded-full bg-cream/95 px-3.5 py-1.5 text-xs font-medium tracking-wide text-charcoal">
          {tour.category[currentLang]}
        </span>
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full text-cream ${styles.iconBg}`}
        >
          <ThemeIcon theme={tour.theme} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-charcoal/45">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 11S1.5 7.2 1.5 4.6a4.5 4.5 0 0 1 9 0C10.5 7.2 6 11 6 11Z"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <circle cx="6" cy="4.6" r="1.4" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          {tour.location[currentLang]}
        </div>

        <h3 className="mt-3 font-display text-xl font-medium leading-snug text-charcoal">
          {tour.title[currentLang]}
        </h3>

        <p className="mt-3 text-[15px] leading-relaxed text-charcoal/65">
          {tour.highlight[currentLang]}
        </p>

        <div className="mt-6 flex items-center gap-3 border-t border-charcoal/8 pt-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-sm font-medium text-forest">
            {hostInitial}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-charcoal">{tour.hostName}</p>
            <p className="text-xs text-charcoal/55">
              {tour.hostTitle[currentLang]}
              {dict.tourCard.hostBadge && ` · ${dict.tourCard.hostBadge}`}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-charcoal/55">
          <span>{tour.duration[currentLang]}</span>
          <span>{tour.groupSize[currentLang]}</span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-charcoal/8 pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-charcoal/45">
              {dict.tourCard.perPerson}
            </p>
            <p className="font-display text-lg font-medium text-charcoal">
              {tour.price}
            </p>
          </div>
          <Link
            href={`/${currentLang}/tours/${tour.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream transition-colors group-hover:bg-forest-dark"
          >
            {dict.tourCard.viewItinerary}
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
