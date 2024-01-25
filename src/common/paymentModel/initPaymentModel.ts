import { InitParams } from 'checkout/initialize';

import { backendModelToPaymentAmount } from './backendModelToPaymentAmount';
import { backendModelToPaymentMethods } from './backendModelToPaymentMethods';
import { getBackendModel } from './getBackendModel';
import { PaymentModel } from './model';
import { toInitContext } from './toInitContext';

export const initPaymentModel = async (initParams: InitParams): Promise<PaymentModel> => {
    const initContext = toInitContext(initParams);
    const { apiEndpoint, invoiceContext } = initContext;
    const backendModel = await getBackendModel(apiEndpoint, invoiceContext);
    const paymentAmount = backendModelToPaymentAmount(backendModel);
    const paymentMethods = backendModelToPaymentMethods(backendModel);
    const result: PaymentModel = {
        initContext,
        paymentMethods,
        paymentAmount,

        paymentState: {
            name: 'uninitialized',
        },
    };
    return result;
};
