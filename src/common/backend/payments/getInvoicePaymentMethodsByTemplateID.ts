import { PaymentMethod } from './types';
import { fetchApi } from '../../../common/utils';

export const getInvoicePaymentMethodsByTemplateID = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceTemplateID: string,
): Promise<PaymentMethod[]> => {
    const path = `v2/processing/invoice-templates/${invoiceTemplateID}/payment-methods`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return response.json();
};
