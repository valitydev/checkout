import { ClientInfo, PaymentResource, PaymentTool } from 'checkout/backend/model';

import v from './capi-version';
import { fetchCapi } from './fetch-capi';

export const createPaymentResource = (
    capiEndpoint: string,
    accessToken: string,
    paymentTool: PaymentTool,
    clientInfo: ClientInfo,
): Promise<PaymentResource> =>
    fetchCapi<PaymentResource>({
        endpoint: `${capiEndpoint}/${v}/processing/payment-resources`,
        accessToken,
        method: 'POST',
        body: {
            paymentTool,
            clientInfo,
        },
    });
