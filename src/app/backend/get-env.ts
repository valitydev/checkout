import { getNocacheValue } from 'checkout/utils';
import { fetchCapi } from './fetch-capi';

export interface Env {
    version: string;
}

export const getEnv = (): Promise<Env> => fetchCapi({ endpoint: `./env.json?nocache=${getNocacheValue()}` });
