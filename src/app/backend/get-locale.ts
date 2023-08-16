import { Locale } from 'checkout/locale';
import { getNocacheValue } from 'checkout/utils';

import { fetchCapi } from './fetch-capi';
import { detectLocale } from '../../locale';

export const getLocale = (locale: string): Promise<Locale> =>
    fetchCapi({
        endpoint: `../v1/locale/${detectLocale(locale)}.json?nocache=${getNocacheValue()}`,
    });
