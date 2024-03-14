import { InvoiceTemplate } from './paymentModel';
import { fetchApi } from '../../utils';

export const getInvoiceTemplateByID = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceTemplateID: string,
): Promise<InvoiceTemplate> => {
    const path = `v2/processing/invoice-templates/${invoiceTemplateID}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return response.json();
};
