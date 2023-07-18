import { fetchCapi } from './fetch-capi';

describe('fetch capi', () => {
    test('should do GET request', async () => {
        const expected = {
            someField: 'someValue'
        };

        const mockFetch = jest.fn();
        mockFetch.mockResolvedValue({
            status: 200,
            ok: true,
            json: async () => expected
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
                'X-Request-ID': expect.any(String)
            },
            method: 'GET'
        });
    });

    test('should do POST request', async () => {
        const expected = {
            someField: 'someValue'
        };

        const mockFetch = jest.fn();
        mockFetch.mockResolvedValue({
            status: 200,
            ok: true,
            json: async () => expected
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
                'X-Request-ID': expect.any(String)
            },
            method
        });
    });

    test('should catch 500 status response', async () => {
        const mockFetch = jest.fn();
        const statusText = 'Internal Server Error';
        mockFetch.mockResolvedValue({
            status: 500,
            ok: false,
            statusText
        });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';
        try {
            await fetchCapi({ endpoint, accessToken });
        } catch (error) {
            expect(error).toStrictEqual({ status: 500, statusText, details: undefined });
        }
    });

    test('should retry json reject', async () => {
        const errorMsg = 'Read json error';
        const expected = {
            someField: 'someValue'
        };
        const mockFetchJson = jest
            .fn()
            .mockRejectedValueOnce(errorMsg)
            .mockRejectedValueOnce(errorMsg)
            .mockResolvedValueOnce(expected);
        const mockFetch = jest.fn().mockResolvedValue({
            status: 200,
            ok: true,
            json: mockFetchJson
        });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';

        const retryDelay = 50;
        const retryLimit = 10;

        const result = await fetchCapi({ endpoint, accessToken }, retryDelay, retryLimit);
        expect(result).toStrictEqual(expected);
        expect(mockFetchJson).toHaveBeenCalledTimes(3);
    });

    test('should retry failed fetch requests', async () => {
        const expected = {
            someField: 'someValue'
        };

        const mockFetch = jest
            .fn()
            .mockRejectedValueOnce(new Error('TypeError: Failed to fetch'))
            .mockRejectedValueOnce(new Error('TypeError: Failed to fetch'))
            .mockResolvedValueOnce({
                status: 200,
                ok: true,
                json: async () => expected
            });
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';

        const retryDelay = 50;
        const retryLimit = 10;

        const result = await fetchCapi({ endpoint, accessToken }, retryDelay, retryLimit);

        expect(result).toStrictEqual(expected);
        expect(mockFetch).toHaveBeenCalledTimes(3);
        const requestInit = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8',
                'X-Request-ID': expect.any(String)
            },
            method: 'GET'
        };
        expect(mockFetch).toHaveBeenCalledWith(endpoint, requestInit);
        expect(mockFetch).toHaveBeenCalledWith(endpoint, requestInit);
        expect(mockFetch).toHaveBeenCalledWith(endpoint, requestInit);
    });

    test('should retry failed fetch requests based on config', async () => {
        const expectedError = new Error('TypeError: Failed to fetch');
        const mockFetch = jest.fn().mockRejectedValue(expectedError);
        global.fetch = mockFetch;

        const endpoint = 'https://api.test.com/endpoint';
        const accessToken = 'testToken';

        const retryDelay = 50;
        const retryLimit = 10;

        try {
            await fetchCapi({ endpoint, accessToken }, retryDelay, retryLimit);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
        expect(mockFetch).toHaveBeenCalledTimes(retryLimit);
    });
});
