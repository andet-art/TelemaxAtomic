import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '@/i18n/en.json';
import translationMK from '@/i18n/mk.json';
import translationSQ from '@/i18n/sq.json'; // ✅ correct import

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    mk: { translation: translationMK },
    sq: { translation: translationSQ }, // ✅ correct key
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
