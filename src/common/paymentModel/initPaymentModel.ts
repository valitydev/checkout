import { InitParams } from 'checkout/initialize';

import { PaymentModel } from './model';
import { delay } from '../utils';

export const initPaymentModel = async (initParams: InitParams): Promise<PaymentModel> => {
    await delay(3000);
    const payloadMock: PaymentModel = {
        paymentState: {
            name: 'uninitialized',
        },
        availablePaymentMethods: [{ name: 'BankCard' }],
        paymentCreationContext: {
            invoiceContext: {
                type: 'invoice',
                invoiceID: 'invoiceIDMock',
                invoiceAccessToken: 'invoiceAccessTokenMock',
            },
            isExternalIDIncluded: false,
        },
        paymentAmount: {
            value: 10000,
            currency: 'RUB',
        },
    };
    return payloadMock;
};
