import { METADATA_NAMESPACE, ServiceProvider, ServiceProviderLogoMetadata } from 'checkout/backend';

export const getLogoMetadata = (serviceProvider: ServiceProvider): ServiceProviderLogoMetadata | undefined =>
    serviceProvider?.metadata?.[METADATA_NAMESPACE]?.logo;
