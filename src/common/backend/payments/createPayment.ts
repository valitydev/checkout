import { Payer, Payment, PaymentFlow } from './paymentModel';
import { fetchApi } from '../../utils';

export type PaymentParams = {
    flow: PaymentFlow;
    payer: Payer;
    makeRecurrent: boolean;
    metadata: Record<string, any>;
    externalID?: string;
};

export const createPayment = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    params: PaymentParams,
): Promise<Payment> => {
    const path = `v2/processing/invoices/${invoiceID}/payments`;
    const response = await fetchApi(capiEndpoint, accessToken, 'POST', path, params);
    return response.json();
};
