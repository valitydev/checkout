import { withRetry } from './withRetry';

// Mock the delay function to avoid actual waiting time during tests
jest.mock('./delay', () => ({
    delay: jest.fn(() => Promise.resolve()),
}));

describe('withRetry', () => {
    it('retries until success for recoverable errors', async () => {
        const mockRecoverableErrorFn = jest
            .fn()
            .mockRejectedValueOnce(new Error('Fail')) // Fail the first time
            .mockResolvedValueOnce('Recovered'); // Succeed the second time
        const retriedFn = withRetry(mockRecoverableErrorFn, 2, 100);

        await expect(retriedFn()).resolves.toEqual('Recovered');
        expect(mockRecoverableErrorFn).toHaveBeenCalledTimes(2); // The function should be retried once
    });

    it('throws immediately on last attempt without further delay', async () => {
        const mockFailFn = jest.fn().mockRejectedValue(new Error('Mock error'));
        const retriedFn = withRetry(mockFailFn, 3, 1000); // Allow for retries

        const startTime = Date.now();
        await expect(retriedFn()).rejects.toThrow('Mock error');
        const endTime = Date.now();

        // Adjusting expectation due to potential slight delays in promise rejection handling
        // Ensure that the total execution time is significantly less than the cumulative delay that would have occurred
        expect(endTime - startTime).toBeLessThan(1000); // Significantly less than if it had waited after the last retry
        expect(mockFailFn).toHaveBeenCalledTimes(3); // Attempted thrice
    });
});
