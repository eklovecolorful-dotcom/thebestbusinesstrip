import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import AITripBuilder from "@/components/ai-trip-builder";

export default async function AITripBuilderSection() {
  const currentLang = await lang();
  if (!hasLocale(currentLang)) notFound();
  const dict = await getDictionary();

  return (
    <section
      id="ai-trip-builder"
      className="relative overflow-hidden bg-forest-dark py-24 text-cream sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[480px] w-[480px] rounded-full bg-forest-light/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
            {dict.aiTripBuilder.kicker}
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-cream sm:text-5xl">
            {dict.aiTripBuilder.heading}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-cream/70">
            {dict.aiTripBuilder.subheading}
          </p>
        </div>

        <div className="mt-12">
          <AITripBuilder dict={dict.aiTripBuilder} lang={currentLang} />
        </div>
      </div>
    </section>
  );
}
