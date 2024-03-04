import { Gateway } from './types';
import { extractError, fetchApi } from '../../../common/utils';

export const getGateways = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
): Promise<Gateway[]> => {
    const queryParams = new URLSearchParams({
        invoiceId: invoiceID,
        paymentId: paymentID,
    }).toString();
    const path = `p2p/payments/gateways?${queryParams}`;
    try {
        const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch gateways: ${extractError(error)}`);
        throw new Error(`Failed to fetch gateways: ${extractError(error)}`);
    }
};
