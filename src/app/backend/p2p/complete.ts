import { fetchCapi } from '../fetch-capi';

export type CompleteInfo = {
    invoiceId: string;
    paymentId: string;
    payerTransactionId?: string;
};

export const complete = (capiEndpoint: string, accessToken: string, info: CompleteInfo) =>
    fetchCapi({
        method: 'POST',
        endpoint: `${capiEndpoint}/p2p/payments/complete`,
        accessToken,
        body: info,
    });
