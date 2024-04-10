import { createContext } from 'react';

export type Locale = Record<string, string | any>;

export type LocaleContextProps = {
    localeCode: string;
    l: Locale;
};

export const LocaleContext = createContext<LocaleContextProps>({
    localeCode: '',
    l: {},
});
