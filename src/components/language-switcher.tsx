import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "zh", label: "中文" },
];

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: Locale;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-charcoal/15 p-1 text-xs font-medium">
      {OPTIONS.map((option) => (
        <Link
          key={option.locale}
          href={`/${option.locale}`}
          aria-current={option.locale === currentLang ? "page" : undefined}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            option.locale === currentLang
              ? "bg-forest text-cream"
              : "text-charcoal/60 hover:text-forest"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
