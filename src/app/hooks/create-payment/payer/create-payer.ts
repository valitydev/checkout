import { PayerType, PaymentResourcePayer } from 'checkout/backend';
import { createPaymentResource } from './create-payment-resource';
import { createSessionInfo } from './create-session-info';
import { toContactInfo } from './to-contact-info';
import { CreatePayerParams } from './types';

export const createPayer = async ({
    capiEndpoint,
    urlShortenerEndpoint,
    origin,
    payableInvoice,
    initConfig,
    formData
}: CreatePayerParams): Promise<PaymentResourcePayer> => {
    const { paymentToolToken, paymentSession } = await createPaymentResource(
        capiEndpoint,
        payableInvoice.invoiceAccessToken,
        formData
    );
    const sessionInfo = await createSessionInfo(
        urlShortenerEndpoint,
        origin,
        initConfig.redirectUrl,
        payableInvoice,
        formData
    );
    const contactInfo = toContactInfo(initConfig, formData.values);
    return {
        payerType: PayerType.PaymentResourcePayer,
        paymentToolToken,
        paymentSession,
        contactInfo,
        sessionInfo
    };
};
