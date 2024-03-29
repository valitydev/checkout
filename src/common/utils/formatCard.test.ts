import { formatCard } from './formatCard';

describe('formatCard', () => {
    // Test formatting without a card object (i.e., no gaps, just clean up non-digit chars)
    it('should format PAN by removing non-digit characters when card object is not provided', () => {
        const pan = '1234-5678-9012-3456';
        expect(formatCard(pan, {} as any)).toBe('1234567890123456');
    });

    // Test formatting with a card object, including gap handling
    it('should format PAN correctly with specified gaps', () => {
        const pan = '1234567890123456';
        const card = {
            lengths: [16],
            gaps: [4, 8, 12],
        };
        expect(formatCard(pan, { card })).toBe('1234 5678 9012 3456');
    });

    // Test ensuring PAN is trimmed to the upper length limit
    it('should trim PAN to the upper length limit of the card', () => {
        const pan = '12345678901234567890';
        const card = {
            lengths: [16], // Upper limit set to 16
            gaps: [4, 8, 12],
        };
        expect(formatCard(pan, { card })).toBe('1234 5678 9012 3456');
    });

    // Test ensuring function handles PAN shorter than upper length limit gracefully
    it('should handle PANs shorter than the upper length limit gracefully', () => {
        const pan = '1234567';
        const card = {
            lengths: [16],
            gaps: [4, 8, 12],
        };
        expect(formatCard(pan, { card })).toBe('1234 567');
    });

    // Test ensuring function handles reverse gap insertion correctly
    it('should not reverse gaps for each call', () => {
        const pan = '1234567890123456';
        const card = {
            lengths: [16],
            gaps: [4, 8, 12],
        };
        // Call the function twice with the same parameters
        expect(formatCard(pan, { card })).toBe('1234 5678 9012 3456');
        expect(formatCard(pan, { card })).toBe('1234 5678 9012 3456');
    });
});
