import { extractError } from './extractError';

describe('extractError', () => {
    it('should return the correct message for standard Error instances', () => {
        const error = new Error('Test error message');
        expect(extractError(error)).toBe('Error: Test error message');
    });

    it('should return the message from a custom error object with details', () => {
        const error = {
            details: {
                message: 'Custom error message',
            },
        };
        expect(extractError(error)).toBe('Custom error message');
    });

    it('should return a default message for non-Error objects without a message', () => {
        const error = { someProperty: 'someValue' };
        expect(extractError(error)).toBe('An unexpected error occurred.');
    });

    it('should handle null errors gracefully', () => {
        const error = null;
        expect(extractError(error)).toBe('An unexpected error occurred.');
    });

    it('should handle undefined errors gracefully', () => {
        const error = undefined;
        expect(extractError(error)).toBe('An unexpected error occurred.');
    });

    it('should return a default message for errors without a recognizable structure', () => {
        const error = 'Some string error';
        expect(extractError(error)).toBe('An unexpected error occurred.');
    });
});
