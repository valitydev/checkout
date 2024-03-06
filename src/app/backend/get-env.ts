import { fetchCapi } from './fetch-capi';
import { getNocacheValue } from '../../common/utils';

export interface Env {
    version: string;
}

export const getEnv = (): Promise<Env> => fetchCapi({ endpoint: `./env.json?nocache=${getNocacheValue()}` });
