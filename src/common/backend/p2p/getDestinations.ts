import { Destination } from './types';
import { fetchApi } from '../../../common/utils';

export const getDestinations = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
    gatewayID?: string,
): Promise<Destination[]> => {
    const queryParams = new URLSearchParams({
        invoiceId: invoiceID,
        paymentId: paymentID,
    });
    if (gatewayID) {
        queryParams.append('gatewayId', gatewayID);
    }
    const path = `p2p/payments/destinations?${queryParams.toString()}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return await response.json();
};
