import { Locale } from 'checkout/locale';
import { getNocacheValue } from 'checkout/utils';

import { fetchCapi } from './fetch-capi';

export const getLocale = (locale: string): Promise<Locale> =>
    fetchCapi({
        endpoint: `./locale/${locale}.json?nocache=${getNocacheValue()}`,
    });
