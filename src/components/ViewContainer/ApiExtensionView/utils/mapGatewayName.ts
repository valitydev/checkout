import { Locale } from 'checkout/contexts';

export const mapGatewayName = (gatewayName: string, l: Locale): string => {
    const gateways = l?.['p2p.gateways'] ?? {};
    return gateways[gatewayName.toLowerCase()] ?? gatewayName;
};
