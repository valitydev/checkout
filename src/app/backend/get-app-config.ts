import { AppConfig } from './app-config';
import { getNocacheValue } from 'checkout/utils';
import { fetchCapi } from './fetch-capi';

export const getAppConfig = (): Promise<AppConfig> =>
    fetchCapi({ endpoint: `../appConfig.json?nocache=${getNocacheValue()}` });
