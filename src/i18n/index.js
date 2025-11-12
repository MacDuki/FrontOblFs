import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translate.js';
import esTranslations from './locales/es/translate.js';


const storedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: storedLanguage, // Default language
    fallbackLng: 'en', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
