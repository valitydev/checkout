import { Destination } from './types';
import { fetchApi } from '../../../common/utils';

export const getDestinations = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
    gatewayID: string,
): Promise<Destination[]> => {
    const queryParams = new URLSearchParams({
        invoiceId: invoiceID,
        paymentId: paymentID,
        gatewayId: gatewayID,
    }).toString();
    const path = `p2p/payments/destinations?${queryParams}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return await response.json();
};
