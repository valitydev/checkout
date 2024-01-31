import { CheckoutServiceProviderMetadata } from 'checkout/backend';

import { getMetadata } from './getMetadata';
import { isNil } from './isNil';
import { TerminalServiceProvider } from '../paymentModel';

export const findMetadata = (
    serviceProviders: TerminalServiceProvider[] | null,
    provider: string,
): CheckoutServiceProviderMetadata => {
    const emptyMetadata = {} as CheckoutServiceProviderMetadata;
    if (isNil(serviceProviders) || serviceProviders.length === 0) {
        return emptyMetadata;
    }
    const metadata = serviceProviders.find((sp) => sp.id === provider)?.metadata;
    return getMetadata(metadata);
};
