import { PaymentResource, createPaymentResource as request } from 'checkout/backend';
import { toPaymentTool } from '../to-payment-tool';
import { FormData } from '../types';

export const createPaymentResource = (
    capiEndpoint: string,
    invoiceAccessToken: string,
    formData: FormData
): Promise<PaymentResource> => {
    const paymentTool = toPaymentTool(formData);
    return request(capiEndpoint, invoiceAccessToken, paymentTool);
};
