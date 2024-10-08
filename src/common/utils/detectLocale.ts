import { isNil } from './isNil';

const locales = ['ru', 'en', 'pt', 'tr', 'az', 'ar', 'tj', 'uz'];

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
