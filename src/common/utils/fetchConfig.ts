import { getNocacheValue } from './getNocacheValue';

export const fetchConfig = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${path}?nocache=${getNocacheValue()}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch config: ${path}`);
    }
    return response.json();
};
