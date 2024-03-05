import { extractError, fetchApi } from '../../../common/utils';

export type CompleteInfo = {
    invoiceId: string;
    paymentId: string;
    payerTransactionId?: string;
};

export const complete = async (capiEndpoint: string, accessToken: string, info: CompleteInfo): Promise<void> => {
    try {
        await fetchApi(capiEndpoint, accessToken, 'POST', 'p2p/payments/complete', info);
    } catch (error) {
        console.error(`Failed to fetch complete. ${extractError(error)}`);
        throw new Error(`Failed to fetch complete. ${extractError(error)}`);
    }
};
