import { load } from '@fingerprintjs/fingerprintjs';

import { PaymentResource, PaymentTool, createPaymentResource as request } from 'checkout/backend';

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
    apiEndpoint: string,
    invoiceAccessToken: string,
    paymentTool: PaymentTool,
): Promise<PaymentResource> => {
    const clientInfo = {
        fingerprint: await getFingerprint(),
        ...getClientInfoUrl(),
    };
    return request(apiEndpoint, invoiceAccessToken, paymentTool, clientInfo);
};
