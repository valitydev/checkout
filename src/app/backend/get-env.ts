import { getNocacheValue } from 'checkout/utils';

export interface Env {
    version: string;
}

export const getEnv = (): Promise<Env> =>
    fetch(`../env.json?nocache=${getNocacheValue()}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    }).then((response) => response.json());
