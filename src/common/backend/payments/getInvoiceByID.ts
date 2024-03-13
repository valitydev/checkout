import { Invoice } from './types';
import { fetchApi } from '../../../common/utils';

export const getInvoiceByID = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
): Promise<Invoice> => {
    const path = `v2/processing/invoices/${invoiceID}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return response.json();
};
