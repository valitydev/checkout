import { formatPhoneNumber } from '../formatPhoneNumber';

let mockThrowError = false;

jest.mock('libphonenumber-js/min', () => ({
    AsYouType: jest.fn().mockImplementation(() => {
        if (mockThrowError) {
            throw new Error('Failed to load library');
        }
        return {
            input: jest.fn().mockImplementation((number) => {
                if (number === '1234567890') {
                    return '(123) 456-7890';
                }
                return number;
            }),
        };
    }),
}));

describe('formatPhoneNumber', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        mockThrowError = false;
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('should format a valid phone number', async () => {
        const result = await formatPhoneNumber('1234567890');
        expect(result).toBe('(123) 456-7890');
    });

    it('should return original number when formatting fails', async () => {
        mockThrowError = true;
        const originalNumber = '1234567890';
        const result = await formatPhoneNumber(originalNumber);
        expect(result).toBe(originalNumber);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Format phone number failed: Error: Failed to load library');
    });

    it('should handle empty string', async () => {
        const result = await formatPhoneNumber('');
        expect(result).toBe('');
    });
});
