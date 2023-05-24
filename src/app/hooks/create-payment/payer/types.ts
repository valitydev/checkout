import { FormData, PayableInvoiceData } from '../types';

export type CreatePayerParams = {
    capiEndpoint: string;
    urlShortenerEndpoint: string;
    origin: string;
    initConfig: {
        redirectUrl: string;
        email: string;
        phoneNumber: string;
    };
    formData: FormData;
    payableInvoice: PayableInvoiceData;
};
