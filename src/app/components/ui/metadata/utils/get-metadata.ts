import get from 'lodash-es/get';

import { CheckoutServiceProviderMetadata, METADATA_NAMESPACE, ServiceProvider } from 'checkout/backend';

export const getMetadata = (serviceProvider: ServiceProvider): CheckoutServiceProviderMetadata =>
    get(serviceProvider, ['metadata', METADATA_NAMESPACE], {});
