import { AppConfig } from './app-config';
import { fetchCapi } from './fetch-capi';
import { getNocacheValue } from '../../common/utils';

export const getAppConfig = (): Promise<AppConfig> =>
    fetchCapi({ endpoint: `./appConfig.json?nocache=${getNocacheValue()}` });
