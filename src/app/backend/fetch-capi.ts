import { guid } from 'checkout/utils';
import delay from 'checkout/utils/delay';

export type FetchCapiParams = {
    endpoint: string;
    accessToken: string;
    method?: 'GET' | 'POST' | 'PUT';
    body?: any;
};

const provideResponse = async (response: Response) => {
    try {
        const json = await response.json();
        return response.status >= 200 && response.status <= 300 ? json : Promise.reject(json);
    } catch (ex) {
        return Promise.reject({ responseStatus: response.status });
    }
};

const doFetch = async (param: FetchCapiParams, retryDelay: number, retryLimit: number, attempt: number = 0) => {
    const method = param.method || 'GET';
    try {
        attempt++;
        return await fetch(param.endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${param.accessToken}`,
                'X-Request-ID': guid()
            },
            body: param.body ? JSON.stringify(param.body) : undefined
        });
    } catch (ex) {
        console.warn(`Request failed: ${method} ${param.endpoint} (${ex}). Attempt: ${attempt} of ${retryLimit}`);
        if (attempt === retryLimit) {
            return Promise.reject(ex);
        }
        await delay(retryDelay);
        return doFetch(param, retryDelay, retryLimit, attempt);
    }
};

export const fetchCapi = async <T>(param: FetchCapiParams, retryDelay = 500, retryLimit = 20): Promise<T> => {
    const response = await doFetch(param, retryDelay, retryLimit);
    return provideResponse(response);
};
