import { Locale } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

export const mapGatewayName = (gatewayName: string, l: Locale): string => {
    const result = l[`p2p.gateways`][gatewayName];
    return isNil(result) ? gatewayName : result;
};
