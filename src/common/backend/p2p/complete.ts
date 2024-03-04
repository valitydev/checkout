import { fetchApi } from '../../../common/utils';

export type CompleteInfo = {
    invoiceId: string;
    paymentId: string;
    payerTransactionId?: string;
};

export const complete = async (capiEndpoint: string, accessToken: string, info: CompleteInfo): Promise<void> => {
    await fetchApi(capiEndpoint, accessToken, 'POST', 'p2p/payments/complete', info);
};
