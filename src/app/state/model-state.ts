import { Invoice } from 'checkout/backend/model';

export interface ModelState {
    readonly invoice?: Invoice;
    readonly invoiceAccessToken?: string;
}
