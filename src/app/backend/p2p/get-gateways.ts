import { Gateway } from './model';
import { fetchCapi } from '../fetch-capi';

export const getGateways = (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
): Promise<Gateway[]> =>
    fetchCapi(
        {
            endpoint: `${capiEndpoint}/p2p/payments/gateways?invoiceId=${invoiceID}&paymentId=${paymentID}`,
            accessToken,
        },
        1,
        1,
    );
