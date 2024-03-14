import { ServiceProvider } from './paymentModel';
import { fetchApi } from '../../utils';

export const getServiceProviderByID = async (
    capiEndpoint: string,
    accessToken: string,
    serviceProviderID: string,
): Promise<ServiceProvider> => {
    const path = `v2/processing/service-providers/${serviceProviderID}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return response.json();
};
