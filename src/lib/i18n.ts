import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '@/i18n/en.json';
import translationMK from '@/i18n/mk.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    mk: { translation: translationMK },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
