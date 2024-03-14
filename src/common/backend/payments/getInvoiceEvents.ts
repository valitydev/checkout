import { InvoiceEvent } from './paymentModel';
import { fetchApi, isNil } from '../../utils';

export const getInvoiceEvents = async (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    limit: number,
    eventID?: number,
): Promise<InvoiceEvent[]> => {
    const queryParams = new URLSearchParams({
        limit: limit.toString(),
    });
    if (!isNil(eventID)) {
        queryParams.append('eventID', eventID.toString());
    }
    const path = `v2/processing/invoices/${invoiceID}/events?${queryParams.toString()}`;
    const response = await fetchApi(capiEndpoint, accessToken, 'GET', path);
    return response.json();
};
