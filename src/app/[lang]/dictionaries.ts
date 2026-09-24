import { lang } from "next/root-params";
import { notFound } from "next/navigation";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  zh: () => import("./dictionaries/zh.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const LOCALES = Object.keys(dictionaries) as Locale[];

export const hasLocale = (locale: string | undefined): locale is Locale =>
  typeof locale === "string" && locale in dictionaries;

export const getDictionary = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};
