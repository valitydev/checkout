import { CheckoutServiceProviderMetadata, METADATA_NAMESPACE, ServiceProviderMetadata } from 'checkout/backend';

export const getMetadata = (
    metadata: ServiceProviderMetadata | null,
    namespace = METADATA_NAMESPACE,
): CheckoutServiceProviderMetadata => metadata?.[namespace] || {};
