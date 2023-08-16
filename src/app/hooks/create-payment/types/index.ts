import { HoldExpirationType } from 'checkout/backend';

import { FormData } from './form-data';

export * from '../payer/types';
export * from './form-data';

export type PaymentFlowParams = {
    paymentFlowHold: boolean;
    holdExpiration?: HoldExpirationType;
};

export type CreatePaymentParams = {
    capiEndpoint: string;
    urlShortenerEndpoint: string;
    origin: string;
    initConfig: {
        recurring: boolean;
        metadata: object;
        isExternalIDIncluded: boolean;
        paymentFlowHold: boolean;
        holdExpiration?: HoldExpirationType;
        redirectUrl: string;
        locale: string;
        email: string;
        phoneNumber: string;
    };
    formData: FormData;
    payableInvoice: PayableInvoiceData;
};

export type PayableInvoiceData = {
    invoice: {
        id: string;
        dueDate: string;
        externalID: string;
    };
    invoiceAccessToken: string;
};
