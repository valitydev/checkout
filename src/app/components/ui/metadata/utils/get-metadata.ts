import { METADATA_NAMESPACE, ServiceProvider } from 'checkout/backend';

export const getMetadata = (serviceProvider: ServiceProvider) =>
    serviceProvider ? serviceProvider?.metadata?.[METADATA_NAMESPACE] : {};
