import { delay } from './delay';

// Defining a type for the predicate function
type ShouldRetryPredicate = (error: any) => boolean;

// Default predicate function that allows retry only if the error is an instance of Error
const defaultShouldRetryPredicate: ShouldRetryPredicate = (error: any) => error instanceof Error;

export const withRetry =
    <T>(
        asyncFn: (...args: any[]) => Promise<T>,
        maxRetries = 3,
        retryDelay = 3000,
        shouldRetryPredicate: ShouldRetryPredicate = defaultShouldRetryPredicate,
    ) =>
    async (...args: any[]): Promise<T> => {
        let lastError: any;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await asyncFn(...args);
            } catch (error) {
                lastError = error;
                // If this is the last attempt or the predicate returns false, throw the error immediately
                if (attempt === maxRetries - 1 || !shouldRetryPredicate(error)) {
                    throw lastError;
                }
                await delay(retryDelay);
                // Optional: Increase retryDelay for exponential backoff
                retryDelay *= 2;
            }
        }
        // Technically unreachable, but needed to satisfy TypeScript about returning a promise or throwing an error
        throw lastError;
    };
