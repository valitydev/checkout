/**
 * Extracts a human-readable error message.
 *
 * @param {Error | { details?: { message?: string } } | unknown} error - The error to extract the message from.
 * @returns {string} The extracted error message.
 */
export const extractError = (error: Error | { details?: { message?: string } } | unknown): string => {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    if (typeof error === 'object' && error !== null) {
        const message = (error as { details?: { message?: string } }).details?.message;
        if (typeof message === 'string') {
            return message;
        }
    }
    return 'An unexpected error occurred.';
};
