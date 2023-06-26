import { HoldExpirationType, PaymentMethodName } from 'checkout/backend';
import { PayableFormValues } from 'checkout/state';

export * from './payer/types';

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

export type FormData = {
    method: PaymentMethodName;
    values?: PayableFormValues;
};
