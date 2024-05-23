import { Locale } from 'checkout/contexts';

import { mapGatewayName } from './mapGatewayName';

describe('mapGatewayName', () => {
    it('should return the gateway name if locale path is nil', () => {
        const gatewayName = 'PayPal';
        const locale: Locale = {} as Locale;

        expect(mapGatewayName(gatewayName, locale)).toBe(gatewayName);
    });

    it('should return the gateway name if locale path does not contain the gateway name', () => {
        const gatewayName = 'PayPal';
        const locale: Locale = { p2p: { gateways: {} } } as Locale;

        expect(mapGatewayName(gatewayName, locale)).toBe(gatewayName);
    });

    it('should return the mapped gateway name if locale path contains the gateway name', () => {
        const gatewayName = 'PayPal';
        const mappedGatewayName = 'PayPal Localized';
        const locale: Locale = { p2p: { gateways: { paypal: mappedGatewayName } } } as Locale;

        expect(mapGatewayName(gatewayName, locale)).toBe(mappedGatewayName);
    });

    it('should handle gateway names case insensitively', () => {
        const gatewayName = 'PAYPAL';
        const mappedGatewayName = 'PayPal Localized';
        const locale: Locale = { p2p: { gateways: { paypal: mappedGatewayName } } } as Locale;

        expect(mapGatewayName(gatewayName, locale)).toBe(mappedGatewayName);
    });

    it('should return the original gateway name if locale.p2p is nil', () => {
        const gatewayName = 'PayPal';
        const locale: Locale = { p2p: undefined } as Locale;

        expect(mapGatewayName(gatewayName, locale)).toBe(gatewayName);
    });
});
