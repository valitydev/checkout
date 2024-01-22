import { InitParams } from 'checkout/initialize';

import { PaymentModel } from './types';

const delay = (ms = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

export const initPaymentModel = async (initParams: InitParams): Promise<PaymentModel> => {
    await delay();
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
    console.log('initPaymentModel: initParams -> model', initParams, payloadMock);
    return payloadMock;
};
