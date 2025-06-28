import React from "react";
import { useLocale } from "../context/LocaleContext";
import { TRANSLATIONS } from "../constants/translations";
import { Locale } from "../types";

// Language display names mapping
const LANGUAGE_NAMES: Record<string, string> = {
  "en-US": "English",
  "es-ES": "Español",
  "zh-CN": "中文",
};

const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useLocale();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value as Locale);
  };

  return (
    <div className="relative inline-block text-left">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={handleChange}
        className="block appearance-none w-full bg-white/90 backdrop-blur-sm border border-orange-200 text-slate-700 py-2 px-3 pr-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm font-medium hover:bg-white transition-colors duration-200"
        style={{ minWidth: "100px" }}
      >
        {Object.keys(TRANSLATIONS).map((langKey) => (
          <option key={langKey} value={langKey}>
            {LANGUAGE_NAMES[langKey] || langKey}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-orange-500">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
