import { InvoiceAndToken, InvoiceParamsWithTemplate } from 'checkout/backend/model';

import { fetchCapi } from '.';
import v from './capi-version';

export const createInvoiceWithTemplate = (
    capiEndpoint: string,
    accessToken: string,
    invoiceTemplateID: string,
    params: InvoiceParamsWithTemplate,
): Promise<InvoiceAndToken> =>
    fetchCapi({
        method: 'POST',
        endpoint: `${capiEndpoint}/${v}/processing/invoice-templates/${invoiceTemplateID}/invoices`,
        accessToken,
        body: params,
    });
