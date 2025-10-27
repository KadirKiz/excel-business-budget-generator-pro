import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { deCH } from './locales/de-CH';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'de-CH': { translation: deCH },
      // Future: 'en-US': { translation: enUS },
    },
    lng: 'de-CH',
    fallbackLng: 'de-CH',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

