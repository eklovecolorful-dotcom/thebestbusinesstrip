import { FEATURED_TOURS } from "@/lib/tours";
import TourCard from "@/components/tour-card";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default async function FeaturedTours() {
  const dict = await getDictionary();
  const { featuredTours } = dict;

  return (
    <section id="experiences" className="bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-terracotta">
              {featuredTours.kicker}
            </span>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
              {featuredTours.heading}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-charcoal/65">
              {featuredTours.subheading}
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOURS.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
