import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";

export default async function SiteFooter() {
  const currentLang = await lang();
  if (!hasLocale(currentLang)) notFound();
  const dict = await getDictionary();
  const { footer } = dict;

  const footerColumns = [
    {
      heading: footer.columns.explore.heading,
      links: [
        { label: footer.columns.explore.links.teaCulture, href: "#experiences" },
        { label: footer.columns.explore.links.heritage, href: "#experiences" },
        { label: footer.columns.explore.links.nature, href: "#experiences" },
        { label: footer.columns.explore.links.aiTripBuilder, href: "#ai-trip-builder" },
      ],
    },
    {
      heading: footer.columns.company.heading,
      links: [
        { label: footer.columns.company.links.ourHosts, href: "#hosts" },
        { label: footer.columns.company.links.journal, href: "#journal" },
        { label: footer.columns.company.links.becomeHost, href: "#" },
        { label: footer.columns.company.links.contact, href: "#" },
      ],
    },
    {
      heading: footer.columns.support.heading,
      links: [
        { label: footer.columns.support.links.bookingPolicy, href: "#" },
        { label: footer.columns.support.links.cancellations, href: "#" },
        { label: footer.columns.support.links.faq, href: "#" },
        { label: footer.columns.support.links.travelAdvisory, href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-cream-dim bg-forest-dark text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link
              href={`/${currentLang}`}
              className="flex items-center gap-2 font-display text-lg font-medium tracking-tight text-cream"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-[13px] text-forest-dark">
                TH
              </span>
              {dict.header.brand}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              {footer.blurb}
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="font-display text-sm font-medium tracking-wide text-cream">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/60 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {footer.copyright}</p>
          <p>{footer.location}</p>
        </div>
      </div>
    </footer>
  );
}
