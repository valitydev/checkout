import { logUnavailableResult } from './log-unavailable-result';
import { UnavailableReason } from 'checkout/sagas/log-unavailable-result/check-result';

describe('Result available truthy', () => {
    const params = { available: true };

    test('should undefined', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        logUnavailableResult('', params);
        expect(warnSpy).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });
});

describe('Result available falsy', () => {
    const params = { available: false };

    it('should undefined', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        logUnavailableResult('', params);

        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('should contain param and message', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        logUnavailableResult('testParam', {
            ...params,
            reason: UnavailableReason.capability,
            message: 'Test message.'
        });
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    });
});
