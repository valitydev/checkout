import { formatCard } from 'checkout/utils';

import { formatCardPan } from '../formatCardPan';

// Mock the dependencies
jest.mock('checkout/utils', () => ({
    extractError: jest.fn((error) => error.message),
    formatCard: jest.fn(),
}));

describe('formatCardPan', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        (formatCard as jest.Mock).mockReset();
        // Setup console.error spy and silence it
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.resetModules();
        consoleErrorSpy.mockRestore();
    });

    it('should format card pan successfully', async () => {
        const pan = '4111111111111111';
        const mockValidationResult = {
            card: {
                niceType: 'Visa',
                type: 'visa',
                patterns: [4],
                gaps: [4, 8, 12],
                lengths: [16, 18, 19],
                code: {
                    name: 'CVV',
                    size: 3,
                },
                matchStrength: 1,
            },
            isValid: true,
            isPotentiallyValid: true,
        };

        // Mock successful dynamic import
        jest.mock('card-validator', () => ({
            number: jest.fn().mockReturnValue(mockValidationResult),
        }));

        (formatCard as jest.Mock).mockReturnValue('4111 1111 1111 1111');

        const result = await formatCardPan(pan);

        expect(result).toBe('4111 1111 1111 1111');
        expect(formatCard).toHaveBeenCalledWith(pan, mockValidationResult);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return original pan when card-validator fails to load', async () => {
        const pan = '4111111111111111';

        // Force the dynamic import to fail
        jest.mock('card-validator', () => {
            throw new Error('Failed to load card-validator');
        });

        // Reset formatCard mock to ensure it's not returning a value from previous test
        (formatCard as jest.Mock).mockImplementation(() => pan);

        const result = await formatCardPan(pan);

        expect(result).toBe(pan);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error loading the card-validator library Failed to load card-validator',
        );
    });
});
