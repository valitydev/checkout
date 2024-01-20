import { isNil } from './isNil';

describe('isNil', () => {
    it('returns true for null', () => {
        expect(isNil(null)).toBe(true);
    });

    it('returns true for undefined', () => {
        expect(isNil(undefined)).toBe(true);
    });

    it('returns false for a number', () => {
        expect(isNil(0)).toBe(false);
        expect(isNil(1)).toBe(false);
        expect(isNil(-1)).toBe(false);
    });

    it('returns false for a string', () => {
        expect(isNil('')).toBe(false);
        expect(isNil('string')).toBe(false);
    });

    it('returns false for a boolean', () => {
        expect(isNil(true)).toBe(false);
        expect(isNil(false)).toBe(false);
    });

    it('returns false for an object', () => {
        expect(isNil({})).toBe(false);
        expect(isNil({ key: 'value' })).toBe(false);
    });

    it('returns false for an array', () => {
        expect(isNil([])).toBe(false);
        expect(isNil([1, 2, 3])).toBe(false);
    });
});
