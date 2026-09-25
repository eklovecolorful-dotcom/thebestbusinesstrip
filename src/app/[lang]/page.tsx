import HeroSection from "@/components/hero-section";
import FeaturedTours from "@/components/featured-tours";
import AITripBuilderSection from "@/components/ai-trip-builder-section";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const dict = await getDictionary();

  return (
    <>
      {payment === "success" && (
        <div className="bg-forest px-6 py-3 text-center text-sm text-cream">
          {dict.paymentStatus.success}
        </div>
      )}
      {payment === "cancelled" && (
        <div className="bg-charcoal/80 px-6 py-3 text-center text-sm text-cream">
          {dict.paymentStatus.cancelled}
        </div>
      )}
      <HeroSection />
      <FeaturedTours />
      <AITripBuilderSection />
    </>
  );
}
