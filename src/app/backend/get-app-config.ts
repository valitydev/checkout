import { getNocacheValue } from 'checkout/utils';

import { AppConfig } from './app-config';
import { fetchCapi } from './fetch-capi';

export const getAppConfig = (): Promise<AppConfig> =>
    fetchCapi({ endpoint: `./appConfig.json?nocache=${getNocacheValue()}` });
