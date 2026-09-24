import Link from "next/link";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default async function HeroSection() {
  const dict = await getDictionary();
  const { hero } = dict;

  return (
    <section className="relative overflow-hidden bg-forest-dark text-cream">
      {/* Ambient texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-forest-light/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col px-6 pt-20 pb-28 lg:px-8 lg:pt-28 lg:pb-36">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-gold">
            {hero.badge}
          </span>

          <h1 className="mt-8 font-display text-5xl font-medium leading-[1.08] tracking-tight text-cream sm:text-6xl lg:text-[4.25rem]">
            {hero.headingLine1}
            <br />
            {hero.headingLine2Prefix}{" "}
            <span className="italic text-gold">{hero.headingLine2Highlight}</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/70">
            {hero.subtext}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#experiences"
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[15px] font-medium text-forest-dark transition-transform hover:-translate-y-0.5 hover:brightness-105"
            >
              {hero.ctaExplore}
            </Link>
            <Link
              href="#ai-trip-builder"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 text-[15px] font-medium text-cream transition-colors hover:bg-cream/10"
            >
              {hero.ctaBuild}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
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

          <dl className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-cream/15 pt-8">
            {hero.trustStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-medium text-cream sm:text-3xl">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs leading-snug text-cream/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Layered mountain silhouette */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-24 w-full text-forest sm:h-32"
      >
        <path
          d="M0 140L120 90 240 130 380 60 520 120 650 45 800 110 940 70 1080 130 1220 80 1440 120V180H0Z"
          fill="currentColor"
          opacity="0.55"
        />
        <path
          d="M0 170L160 120 320 160 480 100 640 155 800 95 960 150 1120 110 1280 160 1440 130V180H0Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
