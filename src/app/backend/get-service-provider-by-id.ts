import { fetchCapi, ServiceProvider } from '.';
import v from './capi-version';

export const getServiceProviderByID = (
    capiEndpoint: string,
    accessToken: string,
    serviceProviderID: string
): Promise<ServiceProvider> =>
    fetchCapi({
        endpoint: `${capiEndpoint}/${v}/processing/service-providers/${serviceProviderID}`,
        accessToken
    });
