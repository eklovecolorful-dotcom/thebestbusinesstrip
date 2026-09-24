import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getDictionary, hasLocale, LOCALES } from "./dictionaries";
import { notFound } from "next/navigation";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function RootLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang === "zh" ? "zh-Hant" : lang}
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning
    > 
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans">
        <SiteHeader />
        <main className="flex-1">{props.children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
