import { fetchCapi } from './fetch-capi';

describe('fetch capi', () => {
    test('should do GET request', async () => {
        const expected = {
            someField: 'someValue',
        };

        const mockFetch = jest.fn();
        mockFetch.mockResolvedValue({
            status: 200,
            ok: true,
            json: async () => expected,
        });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';

        const result = await fetchCapi({ endpoint, accessToken });

        expect(result).toStrictEqual(expected);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8',
                'X-Request-ID': expect.any(String),
            },
            method: 'GET',
        });
    });

    test('should do POST request', async () => {
        const expected = {
            someField: 'someValue',
        };

        const mockFetch = jest.fn();
        mockFetch.mockResolvedValue({
            status: 200,
            ok: true,
            json: async () => expected,
        });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';
        const body = { bodyField: 'bodyFieldVal' };
        const method = 'POST';
        const result = await fetchCapi({ endpoint, accessToken, method, body });

        expect(result).toStrictEqual(expected);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(endpoint, {
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8',
                'X-Request-ID': expect.any(String),
            },
            method,
        });
    });

    test('should catch 500 status response', async () => {
        const mockFetch = jest.fn();
        const statusText = 'Internal Server Error';
        mockFetch.mockResolvedValue({
            status: 500,
            ok: false,
            statusText,
        });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';
        try {
            await fetchCapi({ endpoint, accessToken });
        } catch (error) {
            expect(error).toStrictEqual({
                status: 500,
                statusText,
                details: undefined,
            });
        }
    });

    test('should catch json reject', async () => {
        const errorMsg = 'Read json error';
        const mockFetchJson = jest.fn().mockRejectedValueOnce(errorMsg);
        const mockFetch = jest.fn().mockResolvedValue({
            status: 200,
            ok: true,
            json: mockFetchJson,
        });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';

        try {
            await fetchCapi({ endpoint, accessToken });
        } catch (error) {
            expect(error).toStrictEqual(errorMsg);
        }
    });
});
