import { load } from '@fingerprintjs/fingerprintjs';

import { PaymentResource, createPaymentResource as request } from 'checkout/backend';

import { toPaymentTool } from './to-payment-tool';
import { FormData } from '../types';

const getClientInfoUrl = (): { url: string } | undefined => {
    if (document.referrer === '') return;
    const url = new URL(document.referrer);
    return { url: url.origin };
};

const getFingerprint = (): Promise<string> =>
    load()
        .then((fp) => fp.get())
        .then(({ visitorId }) => visitorId);

export const createPaymentResource = async (
    capiEndpoint: string,
    invoiceAccessToken: string,
    formData: FormData,
): Promise<PaymentResource> => {
    const paymentTool = toPaymentTool(formData);
    const clientInfo = {
        fingerprint: await getFingerprint(),
        ...getClientInfoUrl(),
    };
    return request(capiEndpoint, invoiceAccessToken, paymentTool, clientInfo);
};
