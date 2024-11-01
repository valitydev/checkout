import { normalizePhoneNumber } from '../normalizePhoneNumber';

describe('normalizePhoneNumber', () => {
    it('should return the same number when it already starts with +', () => {
        expect(normalizePhoneNumber('+12345678900')).toBe('+12345678900');
        expect(normalizePhoneNumber('+44123456789')).toBe('+44123456789');
    });

    it('should add + prefix when number does not start with +', () => {
        expect(normalizePhoneNumber('12345678900')).toBe('+12345678900');
        expect(normalizePhoneNumber('44123456789')).toBe('+44123456789');
    });

    it('should handle empty string', () => {
        expect(normalizePhoneNumber('')).toBe('+');
    });
});
