import { fetchCapi } from './fetch-capi';
import { getNocacheValue } from '../../common/utils';

export const getLocale = (locale: string): Promise<any> =>
    fetchCapi({
        endpoint: `./locale/${locale}.json?nocache=${getNocacheValue()}`,
    });
