import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/components/language-switcher";

export default async function SiteHeader() {
  const currentLang = await lang();
  if (!hasLocale(currentLang)) notFound();
  const dict = await getDictionary();

  const navLinks = [
    { label: dict.header.nav.experiences, href: "#experiences" },
    { label: dict.header.nav.aiTripBuilder, href: "#ai-trip-builder" },
    { label: dict.header.nav.ourHosts, href: "#hosts" },
    { label: dict.header.nav.journal, href: "#journal" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link
          href={`/${currentLang}`}
          className="flex items-center gap-2 font-display text-lg font-medium tracking-tight text-forest"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-[13px] text-cream">
            TH
          </span>
          <span>{dict.header.brand}</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] text-charcoal/70 transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLang={currentLang} />

          <Link
            href="#ai-trip-builder"
            className="hidden rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-forest-dark md:inline-block"
          >
            {dict.header.cta}
          </Link>

          <button
            type="button"
            aria-label={dict.header.menuAriaLabel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 4.5H17M1 9H17M1 13.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
