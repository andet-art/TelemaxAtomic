import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  lang: 'en' | 'mk' | 'al';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'en' | 'mk' | 'al'>('en');

  const toggleLanguage = () => {
    const languages: ('en' | 'mk' | 'al')[] = ['en', 'mk', 'al'];
    const currentIndex = languages.indexOf(lang);
    setLang(languages[(currentIndex + 1) % languages.length]);
  };

  const translations = {
    en: { home: 'Home', about: 'About' },
    mk: { home: 'Дома', about: 'За нас' },
    al: { home: 'Shtëpia', about: 'Rreth nesh' },
  };

  const t = (key: string) => translations[lang][key as keyof typeof translations['en']] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
