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

const case2 = [
    {
        method: PaymentMethodName.BankCard
    },
    {
        method: PaymentMethodName.DigitalWallet,
        providers: ['sticpay']
    }
];

export const getInvoicePaymentMethods = (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string
): Promise<PaymentMethod[]> => {
    console.log(capiEndpoint, accessToken, invoiceID, v);
    return Promise.resolve(case2);
};
