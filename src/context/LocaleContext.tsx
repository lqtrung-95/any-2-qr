import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Locale } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const findMatchingLocale = (locale: string): Locale => {
  if (TRANSLATIONS[locale]) return locale as Locale;
  const lang = locale.split("-")[0];
  const match = Object.keys(TRANSLATIONS).find((key) =>
    key.startsWith(lang + "-")
  );
  return (match || "en-US") as Locale;
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialLocale = (): Locale => {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale) {
      return findMatchingLocale(storedLocale);
    }
    const browserLocale = navigator.languages?.[0] || navigator.language || "en-US";
    return findMatchingLocale(browserLocale);
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
