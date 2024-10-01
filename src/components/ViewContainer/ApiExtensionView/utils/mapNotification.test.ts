import { Locale } from 'checkout/contexts';

import { mapNotification } from './mapNotifications';

describe('mapNotification', () => {
    const mockLocale: Locale = {
        'p2p.notification': {
            success: 'Success message',
            error: 'Error message',
        },
    };

    it('should return the mapped notification when it exists', () => {
        expect(mapNotification('success', mockLocale)).toBe('Success message');
        expect(mapNotification('error', mockLocale)).toBe('Error message');
    });

    it('should return the original code when the notification does not exist', () => {
        expect(mapNotification('unknown', mockLocale)).toBe('unknown');
    });

    it('should handle undefined locale', () => {
        expect(mapNotification('success', undefined)).toBe('success');
    });

    it('should handle empty p2p.notification object', () => {
        const emptyLocale: Locale = { 'p2p.notification': {} };
        expect(mapNotification('success', emptyLocale)).toBe('success');
    });

    it('should handle missing p2p.notification key', () => {
        const incompleteLocale: Locale = {};
        expect(mapNotification('success', incompleteLocale)).toBe('success');
    });
});
