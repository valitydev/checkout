import { InvoiceAndToken } from './paymentModel';
import { fetchApi } from '../../utils';

export type InvoiceParamsWithTemplate = {
    amount: number;
    currency: string;
    metadata: object;
};

export const createInvoiceWithTemplate = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceTemplateID: string,
    params: InvoiceParamsWithTemplate,
): Promise<InvoiceAndToken> => {
    const path = `v2/processing/invoice-templates/${invoiceTemplateID}/invoices`;
    const response = await fetchApi(capiEndpoint, accessToken, 'POST', path, params);
    return response.json();
};
