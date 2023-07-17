import guid from 'checkout/utils/guid';
import delay from 'checkout/utils/delay';

export type FetchCapiParams = {
    endpoint: string;
    accessToken?: string;
    method?: 'GET' | 'POST' | 'PUT';
    body?: any;
};

const getDetails = async (response: Response) => {
    try {
        return await response.json();
    } catch {
        return undefined;
    }
};

const provideResponse = async (response: Response) => {
    try {
        if (response.ok) {
            return await response.json();
        }
        return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            details: await getDetails(response)
        });
    } catch (ex) {
        console.error('Read response json error', ex);
        return Promise.reject(ex);
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
                Authorization: param.accessToken ? `Bearer ${param.accessToken}` : undefined,
                'X-Request-ID': guid()
            },
            body: param.body ? JSON.stringify(param.body) : undefined
        });
    } catch (ex) {
        if (attempt === retryLimit) {
            return Promise.reject(ex);
        }
        await delay(retryDelay);
        return doFetch(param, retryDelay, retryLimit, attempt);
    }
};

export const fetchCapi = async <T>(param: FetchCapiParams, retryDelay = 1000, retryLimit = 20): Promise<T> => {
    const response = await doFetch(param, retryDelay, retryLimit);
    return await provideResponse(response);
};
