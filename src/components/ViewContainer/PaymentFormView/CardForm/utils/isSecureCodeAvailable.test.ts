import { number } from 'card-validator';

import { isSecureCodeAvailable } from './isSecureCodeAvailable';

jest.mock('card-validator');

describe('isSecureCodeAvailable', () => {
    it('returns false for Uzcard', () => {
        (number as jest.Mock).mockReturnValue({ card: { type: 'uzcard' } });
        expect(isSecureCodeAvailable('some-uzcard-number')).toBe(false);
    });

    it('returns false for Humo card', () => {
        (number as jest.Mock).mockReturnValue({ card: { type: 'humo' } });
        expect(isSecureCodeAvailable('some-humo-number')).toBe(false);
    });

    it('returns true for other card types', () => {
        (number as jest.Mock).mockReturnValue({ card: { type: 'visa' } });
        expect(isSecureCodeAvailable('some-visa-number')).toBe(true);
    });

    it('returns true for invalid card number', () => {
        (number as jest.Mock).mockReturnValue(null);
        expect(isSecureCodeAvailable('invalid-number')).toBe(true);
    });

    it('returns true when card number is null or undefined', () => {
        expect(isSecureCodeAvailable(null)).toBe(true);
        expect(isSecureCodeAvailable(undefined)).toBe(true);
    });
});
