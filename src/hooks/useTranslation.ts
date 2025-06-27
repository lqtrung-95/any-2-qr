import { TRANSLATIONS } from "../constants/translations";
import { Locale } from "../types";

const findMatchingLocale = (locale: string): Locale => {
  if (TRANSLATIONS[locale]) return locale as Locale;
  const lang = locale.split("-")[0];
  const match = Object.keys(TRANSLATIONS).find((key) =>
    key.startsWith(lang + "-")
  );
  return (match || "en-US") as Locale;
};

export const useTranslation = () => {
  const appLocale = "{{APP_LOCALE}}";
  const browserLocale =
    navigator.languages?.[0] || navigator.language || "en-US";

  const locale =
    appLocale !== "{{APP_LOCALE}}"
      ? findMatchingLocale(appLocale)
      : findMatchingLocale(browserLocale);

  const t = (key: keyof (typeof TRANSLATIONS)["en-US"]): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS["en-US"][key] || key;
  };

  return { t, locale };
};
