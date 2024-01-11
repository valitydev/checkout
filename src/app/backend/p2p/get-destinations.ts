import { Destination } from './model';
import { fetchCapi } from '../fetch-capi';

export const getDestinations = (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
    gatewayID: string,
): Promise<Destination[]> =>
    fetchCapi({
        endpoint: `${capiEndpoint}/p2p/payments/destinations?invoiceId=${invoiceID}&paymentId=${paymentID}&gatewayId=${gatewayID}`,
        accessToken,
    });
