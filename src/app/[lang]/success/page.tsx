import Link from "next/link";
import { lang } from "next/root-params";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const currentLang = await lang();
  if (!hasLocale(currentLang)) notFound();
  const { session_id: sessionId } = await searchParams;

  return (
    <section className="bg-forest-dark px-6 py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-2xl font-bold text-gold">
          ✓
        </div>

        <h1 className="mt-6 font-display text-3xl font-medium text-cream">
          Booking Confirmed
        </h1>
        <p className="mt-1 font-display text-xl font-medium text-gold">預訂成功</p>

        <div className="mt-8 space-y-3 border-t border-cream/15 pt-8 text-[15px] leading-relaxed text-cream/70">
          <p>
            We&apos;ve received your payment. A confirmation email with your
            full itinerary is on its way — your local host will be in touch
            before your tour date with final details.
          </p>
          <p>
            我們已收到您的付款，確認信與完整行程即將寄至您的信箱——您的在地達人將在出發日期前與您聯繫，確認最終細節。
          </p>
        </div>

        {sessionId && (
          <div className="mt-8 rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-cream/50">
              Stripe Session ID
            </p>
            <p className="mt-1 break-all font-mono text-xs text-cream/60">
              {sessionId}
            </p>
          </div>
        )}

        <Link
          href={`/${currentLang}`}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[15px] font-medium text-forest-dark transition-transform hover:-translate-y-0.5 hover:brightness-105"
        >
          Back to Home / 返回首頁
        </Link>
      </div>
    </section>
  );
}
