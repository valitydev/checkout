import { withRetry } from './withRetry';

// Mock async function that simulates varying behavior
const createMockAsyncFunction = (shouldSucceedAfterAttempts: number, result: string, error: Error): jest.Mock => {
    let attempts = 0;
    return jest.fn(() => {
        attempts++;
        return new Promise((resolve, reject) => {
            if (attempts >= shouldSucceedAfterAttempts) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

describe('withRetry', () => {
    test('should succeed on first attempt', async () => {
        const mockFn = createMockAsyncFunction(1, 'success', new Error('fail'));
        const retriedFn = withRetry(mockFn, 3, 10);

        await expect(retriedFn()).resolves.toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should fail after all retries', async () => {
        const mockFn = createMockAsyncFunction(5, 'success', new Error('fail')); // Succeeds after 5 attempts, but we only retry 3 times
        const retriedFn = withRetry(mockFn, 3, 10);

        await expect(retriedFn()).rejects.toThrow('fail');
        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    test('should succeed after 2 retries', async () => {
        const mockFn = createMockAsyncFunction(3, 'success', new Error('fail')); // Succeeds on the third attempt
        const retriedFn = withRetry(mockFn, 3, 10);

        await expect(retriedFn()).resolves.toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(3);
    });
});
