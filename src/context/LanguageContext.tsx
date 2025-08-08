import React, { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'mk' | 'al';
type Translations = Record<string, Record<string, string>>;

const translations: Translations = {
  en: { home: 'Home', orders: 'Orders', contact: 'Contact', /* … */ },
  mk: { home: 'Дома', orders: 'Нарачки', contact: 'Контакт', /* … */ },
  al: { home: 'Shtëpia', orders: 'Porositë', contact: 'Kontakti', /* … */ },
};

interface LanguageContextValue {
  lang: Lang;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: k => k,
  toggleLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');
  const toggleLanguage = () => {
    const list: Lang[] = ['en','mk','al'];
    const next = (list.indexOf(lang)+1) % list.length;
    setLang(list[next]);
  };
  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
