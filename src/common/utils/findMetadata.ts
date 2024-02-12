import { CheckoutServiceProviderMetadata, METADATA_NAMESPACE, ServiceProviderMetadata } from 'checkout/backend';

import { isNil } from './isNil';
import { TerminalServiceProvider } from '../paymentModel';

export const getMetadata = (
    metadata: ServiceProviderMetadata | null,
    namespace = METADATA_NAMESPACE,
): CheckoutServiceProviderMetadata => metadata?.[namespace] || {};

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
