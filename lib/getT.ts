import { translations, TranslationSchema } from "./i18n";

export function getT(locale: string): TranslationSchema {
  return translations[locale as keyof typeof translations] as TranslationSchema;
}