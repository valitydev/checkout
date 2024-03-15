import { guid } from './guid';

export type ApiError = {
    status: number;
    endpoint: string;
    details: Record<string, any>;
};

export async function fetchApi(
    endpoint: string,
    accessToken: string,
    method: string,
    path: string,
    body?: any,
): Promise<Response> {
    const fullEndpoint = `${endpoint}/${path}`;
    const response = await fetch(fullEndpoint, {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
            'X-Request-ID': guid(),
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let errorDetails: Record<string, any> = {};
        try {
            errorDetails = await response.json();
        } catch (ex) {
            // If the response is not in JSON format or cannot be parsed, errorDetails will remain an empty object
        }
        throw {
            status: response.status,
            endpoint: fullEndpoint,
            details: errorDetails,
        } as ApiError;
    }

    return response;
}
