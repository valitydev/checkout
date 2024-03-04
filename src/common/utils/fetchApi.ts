import guid from 'checkout/utils/guid';

export async function fetchApi(
    endpoint: string,
    accessToken: string,
    method: string,
    path: string,
    body?: any,
): Promise<Response> {
    const response = await fetch(`${endpoint}/${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
            'X-Request-ID': guid(),
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let errorDetails = `API error: ${response.status} Endpoint: ${endpoint}/${path}`;
        try {
            const errorBody = await response.json();
            errorDetails += ` ${JSON.stringify(errorBody)}`;
        } catch (ex) {
            // Ignore error
        }
        throw new Error(errorDetails);
    }

    return response;
}
