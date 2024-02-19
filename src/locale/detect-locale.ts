import isNil from 'checkout/utils/is-nil';

const locales = ['ru', 'en', 'ja', 'pt', 'bn', 'ko', 'tr'];

export const detectLocale = (locale: string | null): string => {
    let result;
    if (isNil(locale)) {
        const language = navigator.language;
        result = detectLocale(language.split('-')[0]);
    } else {
        result = locales.find((item) => item === locale);
    }
    return result || 'en';
};
