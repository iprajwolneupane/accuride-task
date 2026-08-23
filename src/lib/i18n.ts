import enTranslation from '@/locales/en.json';
import frTranslation from '@/locales/fr.json';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';
import { DEFAULT_LOCALE } from '@/constant';


i18next.use({
    type: 'postProcessor',
    name: 'lowercase',
    process: (value: string) => value.toLowerCase(),
});

i18next.use({
    type: 'postProcessor',
    name: 'titlecase',
    process: (value: string) =>
        value.replace(
            /\w\S*/g,
            (word: string) => word.charAt(0).toUpperCase() + word.slice(1),
        ),
});

i18next.use(initReactI18next).init({
    lng: Cookies.get('locale') ?? DEFAULT_LOCALE,
    fallbackLng: 'en',
    resources: {
        en: { translation: enTranslation },
        fr: { translation: frTranslation },
    },
});

export default i18next;