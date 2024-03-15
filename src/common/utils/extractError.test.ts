import { extractError } from './extractError';
import { ApiError } from './fetchApi';

describe('extractError', () => {
    it('should extract message from Error instance', () => {
        const testError = new Error('Test error message');
        expect(extractError(testError)).toEqual('Error: Test error message');
    });

    it('should handle ApiError object with a message in details', () => {
        const testApiError: ApiError = {
            status: 404,
            endpoint: 'https://api.example.com/data',
            details: { message: 'Resource not found' },
        };
        expect(extractError(testApiError)).toEqual('Error 404 at https://api.example.com/data: Resource not found');
    });

    it('should stringify details if message is not a string in ApiError', () => {
        const testApiError: ApiError = {
            status: 500,
            endpoint: 'https://api.example.com/data',
            details: { error: 'Internal Server Error', code: 500 },
        };
        expect(extractError(testApiError)).toEqual(
            `Error 500 at https://api.example.com/data: {"error":"Internal Server Error","code":500}`,
        );
    });

    it('should return a default message for non-object errors', () => {
        expect(extractError('String error')).toEqual('An unexpected error occurred.');
        expect(extractError(1234)).toEqual('An unexpected error occurred.');
        expect(extractError(null)).toEqual('An unexpected error occurred.');
    });

    it('should return a default message for empty objects', () => {
        expect(extractError({})).toEqual('An unexpected error occurred.');
    });

    it('should handle ApiError without details gracefully', () => {
        const testApiError: ApiError = {
            status: 403,
            endpoint: 'https://api.example.com/data',
            details: {},
        };
        expect(extractError(testApiError)).toEqual('Error 403 at https://api.example.com/data: {}');
    });
});
