import { DestinationBankCard, DestinationSBP } from './model';
import { fetchCapi } from '../fetch-capi';

export const getDestinations = (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
    gatewayID: string,
): Promise<DestinationBankCard[] | DestinationSBP[]> =>
    fetchCapi({
        endpoint: `${capiEndpoint}/p2p/payments/destinations?invoiceId=${invoiceID}&paymentId=${paymentID}&gatewayId=${gatewayID}`,
        accessToken,
    });
