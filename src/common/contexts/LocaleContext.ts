import { createContext } from 'react';

import { Locale } from 'checkout/locale';

export type LocaleContextProps = {
    l: Locale;
};

export const LocaleContext = createContext<LocaleContextProps>({
    l: {},
});
