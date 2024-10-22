import { isNil } from './isNil';
import { CheckoutServiceProviderMetadata, METADATA_NAMESPACE, ServiceProviderMetadata } from '../backend/payments';
import { TerminalServiceProvider } from '../paymentModel';

export const getMetadata = (
    metadata: ServiceProviderMetadata | null,
    namespace: keyof ServiceProviderMetadata = METADATA_NAMESPACE,
): CheckoutServiceProviderMetadata => {
    if (metadata && namespace in metadata) {
        return metadata[namespace] as CheckoutServiceProviderMetadata;
    }
    return {};
};

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
