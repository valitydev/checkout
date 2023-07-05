import { CheckoutServiceProviderMetadata, METADATA_NAMESPACE, ServiceProvider } from 'checkout/backend';

export const getMetadata = (serviceProvider: ServiceProvider): CheckoutServiceProviderMetadata =>
    serviceProvider?.metadata?.[METADATA_NAMESPACE] || {};
