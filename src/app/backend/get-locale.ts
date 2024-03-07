import { Locale } from 'checkout/locale';

import { fetchCapi } from './fetch-capi';
import { getNocacheValue } from '../../common/utils';

export const getLocale = (locale: string): Promise<Locale> =>
    fetchCapi({
        endpoint: `./locale/${locale}.json?nocache=${getNocacheValue()}`,
    });
