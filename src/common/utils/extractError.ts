import { ApiError } from './fetchApi';

/**
 * Extracts a human-readable error message.
 *
 * @param {Error | ApiError | unknown} error - The error to extract the message from.
 * @returns {string} The extracted error message.
 */
export const extractError = (error: Error | ApiError | unknown): string => {
    // Handling standard Error instances
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }

    // Handling ApiError objects
    if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        if ('status' in apiError && 'endpoint' in apiError && 'details' in apiError) {
            // Attempting to extract a meaningful message from the details object
            const detailsMessage = apiError.details.message || JSON.stringify(apiError.details);
            return `Error ${apiError.status} at ${apiError.endpoint}: ${detailsMessage}`;
        }
    }

    // Default message for when the error cannot be identified
    return 'An unexpected error occurred.';
};
