import { InitParams } from 'checkout/initialize';

import { backendModelToPaymentAmount } from './backendModelToPaymentAmount';
import { backendModelToPaymentMethods } from './backendModelToPaymentMethods';
import { getBackendModel } from './getBackendModel';
import { toInitContext } from './toInitContext';
import { toInvoiceContext } from './toInvoiceContext';
import { PaymentModel } from './types';

export const initPaymentModel = async ({ initConfig, appConfig }: InitParams): Promise<PaymentModel> => {
    const invoiceContext = toInvoiceContext(initConfig);
    const initContext = toInitContext(initConfig);
    const apiEndpoint = appConfig.capiEndpoint;
    const backendModel = await getBackendModel(apiEndpoint, invoiceContext);
    const paymentAmount = backendModelToPaymentAmount(backendModel);
    const paymentMethods = backendModelToPaymentMethods(backendModel);
    const result: PaymentModel = {
        ...invoiceContext,
        apiEndpoint,
        initContext,
        paymentMethods,
        paymentAmount,
    };
    return result;
};
