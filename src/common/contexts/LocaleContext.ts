import { createContext } from 'react';

export type Locale = Record<string, string | any>;

export type LocaleContextProps = {
    localeCode: string;
    l: Locale;
    changeLocale: (localeCode: string) => void;
};

export const LocaleContext = createContext<LocaleContextProps>({
    localeCode: '',
    l: {},
    changeLocale: () => {},
});
