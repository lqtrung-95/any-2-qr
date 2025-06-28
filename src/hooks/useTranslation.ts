import { TRANSLATIONS } from "../constants/translations";
import { useLocale } from "../context/LocaleContext";

export const useTranslation = () => {
  const { locale } = useLocale();

  const t = (key: keyof (typeof TRANSLATIONS)["en-US"]): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS["en-US"][key] || key;
  };

  return { t, locale };
};
