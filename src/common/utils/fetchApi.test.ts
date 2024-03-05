import { fetchApi } from './fetchApi';

beforeEach(() => {
    global.fetch = jest.fn();
});

describe('fetchApi', () => {
    it('handles successful responses correctly', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ data: 'success' }),
        });

        const response = await fetchApi('https://api.example.com', 'token123', 'GET', 'path');
        const data = await response.json();
        expect(data).toEqual({ data: 'success' });
    });

    it('throws a generic error for non-JSON error responses', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            // Simulating a failure in response.json() method
            json: () => Promise.reject(new Error('Failed to parse JSON')),
        });

        await expect(fetchApi('https://api.example.com', 'token123', 'POST', 'path', {})).rejects.toThrow(
            `Status: 500 Endpoint: https://api.example.com/path`,
        );
    });

    it('throws an error with JSON error details for 400 responses', async () => {
        const errorDetails = { error: 'Bad Request', message: 'Invalid parameters' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ error: 'Bad Request', message: 'Invalid parameters' }),
        });

        await expect(fetchApi('https://api.example.com', 'token123', 'POST', 'path', {})).rejects.toThrow(
            `Status: 400 Endpoint: https://api.example.com/path ${JSON.stringify(errorDetails)}`,
        );
    });
});
