import { PaymentMethod, fetchCapi, PaymentMethodName } from '.';
import v from './capi-version';

// export const getInvoicePaymentMethods = (
//     capiEndpoint: string,
//     accessToken: string,
//     invoiceID: string
// ): Promise<PaymentMethod[]> =>
//     fetchCapi({
//         endpoint: `${capiEndpoint}/${v}/processing/invoices/${invoiceID}/payment-methods`,
//         accessToken
//     });

const case1 = [
    {
        method: PaymentMethodName.DigitalWallet,
        providers: ['sticpay', 'qiwi']
    }
];

const case2 = [
    {
        method: PaymentMethodName.BankCard
    },
    {
        method: PaymentMethodName.DigitalWallet,
        providers: ['sticpay', 'qiwi']
    }
];

export const getInvoicePaymentMethods = (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string
): Promise<PaymentMethod[]> => {
    return Promise.resolve(case2);
};
