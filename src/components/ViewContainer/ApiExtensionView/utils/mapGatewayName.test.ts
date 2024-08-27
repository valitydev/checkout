import { mapGatewayName } from './mapGatewayName';

describe('mapGatewayName', () => {
    let locale;

    beforeEach(() => {
        locale = {
            'p2p.gateways': {
                gatewaya: 'Localized Gateway A',
                gatewayb: 'Localized Gateway B',
                gatewayc: 'Localized Gateway C',
            },
        };
    });

    test('should return the localized gateway name when it exists in the locale, case insensitive', () => {
        expect(mapGatewayName('gatewayA', locale)).toBe('Localized Gateway A');
        expect(mapGatewayName('GATEWAYB', locale)).toBe('Localized Gateway B');
        expect(mapGatewayName('gatewayc', locale)).toBe('Localized Gateway C');
    });

    test('should return the original gateway name when it does not exist in the locale, regardless of case', () => {
        expect(mapGatewayName('unknownGateway', locale)).toBe('unknownGateway');
        expect(mapGatewayName('UNKNOWNGATEWAY', locale)).toBe('UNKNOWNGATEWAY');
    });

    test('should return the original gateway name when the locale does not contain the "p2p.gateways" key', () => {
        const emptyLocale = {};
        expect(mapGatewayName('gatewayA', emptyLocale)).toBe('gatewayA');
    });

    test('should return the original gateway name when the "p2p.gateways" key is an empty object', () => {
        const emptyGatewaysLocale = {
            'p2p.gateways': {},
        };
        expect(mapGatewayName('gatewayA', emptyGatewaysLocale)).toBe('gatewayA');
    });

    test('should return the original gateway name when locale is null or undefined', () => {
        expect(mapGatewayName('gatewayA', null)).toBe('gatewayA');
        expect(mapGatewayName('gatewayA', undefined)).toBe('gatewayA');
    });

    test('should return the original gateway name when gatewayName is an empty string', () => {
        expect(mapGatewayName('', locale)).toBe('');
    });

    test('should handle locale with other unrelated keys', () => {
        const complexLocale = {
            'p2p.gateways': {
                gatewaya: 'Localized Gateway A',
            },
            'other.key': 'some value',
        };
        expect(mapGatewayName('gatewayA', complexLocale)).toBe('Localized Gateway A');
        expect(mapGatewayName('gatewayB', complexLocale)).toBe('gatewayB');
    });
});
