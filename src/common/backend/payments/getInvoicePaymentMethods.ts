import { PaymentMethod } from './paymentModel';
import { fetchApi } from '../../utils';

export const getInvoicePaymentMethods = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
): Promise<PaymentMethod[]> => {
    const path = `v2/processing/invoices/${invoiceID}/payment-methods`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return response.json();
};
