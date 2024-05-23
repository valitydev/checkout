import { Locale } from 'checkout/contexts';

export const mapGatewayName = (gatewayName: string, { p2p: { gateways = {} } = {} }: Locale): string =>
    gateways[gatewayName.toLowerCase()] ?? gatewayName;
