import { applyReplacePattern } from './applyReplacePattern';

describe('applyReplacePattern', () => {
    it('should replace "+" with a space', () => {
        const result = applyReplacePattern('FirstName+LastName', '\\+', ' ');
        expect(result).toBe('FirstName LastName');
    });

    it('should return the original string if pattern is not provided', () => {
        const result = applyReplacePattern('FirstName+LastName');
        expect(result).toBe('FirstName+LastName');
    });

    it('should return the original value if rawValue is not a string', () => {
        const result = applyReplacePattern(12345, '\\+', ' ');
        expect(result).toBe(12345);
    });

    it('should replace pattern with empty string when replaceValue is not provided', () => {
        const result = applyReplacePattern('FirstName+LastName', '\\+');
        expect(result).toBe('FirstNameLastName');
    });

    it('should replace pattern with empty string when replaceValue is undefined', () => {
        const result = applyReplacePattern('FirstName+LastName', '\\+', undefined);
        expect(result).toBe('FirstNameLastName');
    });

    it('should handle an empty string pattern', () => {
        const result = applyReplacePattern('FirstName+LastName', '', ' ');
        expect(result).toBe('FirstName+LastName');
    });

    it('should replace multiple occurrences of the pattern', () => {
        const result = applyReplacePattern('FirstName+MiddleName+LastName', '\\+', ' ');
        expect(result).toBe('FirstName MiddleName LastName');
    });

    it('should return the original string if pattern does not match anything', () => {
        const result = applyReplacePattern('FirstName+LastName', '\\-', ' ');
        expect(result).toBe('FirstName+LastName');
    });
});
