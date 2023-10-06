import guid from 'checkout/utils/guid';

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
    if (response.ok) {
        return await response.json();
    }
    return Promise.reject({
        status: response.status,
        statusText: response.statusText || undefined,
        details: await getDetails(response),
    });
};

const doFetch = async (param: FetchCapiParams) =>
    fetch(param.endpoint, {
        method: param.method || 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: param.accessToken ? `Bearer ${param.accessToken}` : undefined,
            'X-Request-ID': guid(),
        },
        body: param.body ? JSON.stringify(param.body) : undefined,
    });

export const fetchCapi = async <T>(param: FetchCapiParams): Promise<T> => {
    const response = await doFetch(param);
    return await provideResponse(response);
};
