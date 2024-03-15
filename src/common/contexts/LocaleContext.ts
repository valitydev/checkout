import { createContext } from 'react';

export type Locale = Record<string, string | any>;

export type LocaleContextProps = {
    l: Locale;
};

export const LocaleContext = createContext<LocaleContextProps>({
    l: {},
});
