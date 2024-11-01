import { parseNationalNumber } from '../parseNationalNumber';

// Mock the libphonenumber-js import
jest.mock('libphonenumber-js/min', () => ({
    parsePhoneNumber: jest.fn((number) => {
        if (number === '+994501234567') {
            return {
                country: 'AZ',
                nationalNumber: '501234567',
            };
        }
        if (number === '+79123456789') {
            return {
                country: 'RU',
                nationalNumber: '9123456789',
            };
        }
        throw new Error('Invalid phone number');
    }),
}));

describe('parseNationalNumber', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // Mock console.error
    });

    it('should return national number for matching country', async () => {
        const parser = parseNationalNumber(['AZ']);
        const result = await parser('+994501234567');
        expect(result).toBe('501234567');
    });

    it('should return original number for non-matching country', async () => {
        const parser = parseNationalNumber(['RU']);
        const result = await parser('+994501234567');
        expect(result).toBe('+994501234567');
    });

    it('should handle multiple countries', async () => {
        const parser = parseNationalNumber(['RU', 'AZ']);
        const result1 = await parser('+994501234567');
        const result2 = await parser('+79123456789');

        expect(result1).toBe('501234567');
        expect(result2).toBe('9123456789');
    });

    it('should return original number on parsing error', async () => {
        const parser = parseNationalNumber(['AZ']);
        const invalidNumber = 'invalid';
        const result = await parser(invalidNumber);

        expect(result).toBe(invalidNumber);
        expect(console.error).toHaveBeenCalled();
    });
});
