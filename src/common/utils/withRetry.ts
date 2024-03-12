import { delay } from './delay';

/**
 * Creates a retry wrapper for any async function, allowing retries on failure.
 *
 * @param {Function} asyncFn - The asynchronous function to wrap with retry logic.
 * @param {number} maxRetries - The maximum number of retries.
 * @param {number} retryDelay - The initial delay between retries in milliseconds.
 * @returns {Function} - A new function that wraps the original async function with retry logic.
 */
export const withRetry =
    <T>(asyncFn: (...args: any[]) => Promise<T>, maxRetries = 3, retryDelay = 2000) =>
    async (...args: any[]): Promise<T> => {
        let lastError: any;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await asyncFn(...args);
            } catch (error) {
                lastError = error;
                // If this is the last attempt, throw the error immediately
                if (attempt === maxRetries - 1) {
                    throw lastError;
                }
                await delay(retryDelay);
                // Increase retryDelay for exponential backoff
                retryDelay *= 2;
            }
        }
        // Technically unreachable, but needed to satisfy TypeScript about returning a promise or throwing an error
        throw lastError;
    };
