import { createPayer } from './payer';
import { toPaymentFlow } from './to-payment-flow';
import { CreatePaymentParams } from './types';
import { Payment, createPayment as request } from 'checkout/backend';

export const createPayment = async ({
    capiEndpoint,
    urlShortenerEndpoint,
    origin,
    initConfig,
    formData,
    payableInvoice
}: CreatePaymentParams): Promise<Payment> => {
    const { invoice, invoiceAccessToken } = payableInvoice;
    const {
        redirectUrl,
        email,
        phoneNumber,
        paymentFlowHold,
        holdExpiration,
        recurring,
        metadata,
        isExternalIDIncluded
    } = initConfig;
    const payer = await createPayer({
        capiEndpoint,
        urlShortenerEndpoint,
        origin,
        initConfig: {
            redirectUrl,
            email,
            phoneNumber
        },
        formData,
        payableInvoice
    });
    const params = {
        flow: toPaymentFlow({ paymentFlowHold, holdExpiration }),
        payer,
        makeRecurrent: recurring,
        metadata,
        externalID: isExternalIDIncluded ? invoice.externalID : undefined
    };
    return await request(capiEndpoint, invoiceAccessToken, invoice.id, params);
};
