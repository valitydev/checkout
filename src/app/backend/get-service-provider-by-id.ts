import { fetchCapi } from '.';
import v from './capi-version';
import { ServiceProvider } from 'checkout/api-codegen/payments';

export const getServiceProviderByID = (
    capiEndpoint: string,
    accessToken: string,
    serviceProviderID: string
): Promise<ServiceProvider> =>
    fetchCapi({
        endpoint: `${capiEndpoint}/${v}/processing/service-providers/${serviceProviderID}`,
        accessToken
    });
