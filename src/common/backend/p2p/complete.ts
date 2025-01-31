import { fetchApi } from '../../../common/utils';

export type CompleteInfoAttachment = {
    mimeType: string;
    data: string;
};

export type CompleteInfo = {
    invoiceId: string;
    paymentId: string;
    payerTransactionId?: string;
    attachment?: CompleteInfoAttachment;
};

export const complete = async (capiEndpoint: string, accessToken: string, info: CompleteInfo): Promise<void> => {
    await fetchApi(capiEndpoint, accessToken, 'POST', 'p2p/payments/complete', info);
};
