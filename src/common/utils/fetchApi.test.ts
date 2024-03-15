import { fetchApi } from './fetchApi';

// TypeScript type assertion for mocking
declare let global: { fetch: jest.Mock };

beforeEach(() => {
    global.fetch = jest.fn();
});

describe('fetchApi', () => {
    it('handles successful responses correctly', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ data: 'success' }),
        });

        const response = await fetchApi('https://api.example.com', 'token123', 'GET', 'path');
        const data = await response.json();
        expect(data).toEqual({ data: 'success' });
    });

    it('throws an ApiError object for non-JSON error responses', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: () => Promise.reject(new Error('Failed to parse JSON')),
        });

        await expect(fetchApi('https://api.example.com', 'token123', 'POST', 'path', {})).rejects.toEqual({
            status: 500,
            endpoint: 'https://api.example.com/path',
            details: {}, // Assuming failure to parse JSON results in an empty details object
        });
    });

    it('throws an ApiError object with JSON error details for 400 responses', async () => {
        const errorDetails = { error: 'Bad Request', message: 'Invalid parameters' };

        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: () => Promise.resolve(errorDetails),
        });

        await expect(fetchApi('https://api.example.com', 'token123', 'POST', 'path', {})).rejects.toEqual({
            status: 400,
            endpoint: 'https://api.example.com/path',
            details: errorDetails,
        });
    });
});
