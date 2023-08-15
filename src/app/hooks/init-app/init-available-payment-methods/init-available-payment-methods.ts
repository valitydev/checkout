import { InitConfig } from 'checkout/config';

import { setPriority } from './set-priority';
import { toAvailablePaymentMethods } from './to-available-payment-methods';
import { Model } from '..';

export const initAvailablePaymentMethods = (initConfig: InitConfig, { paymentMethods, serviceProviders }: Model) => {
    const methods = toAvailablePaymentMethods(paymentMethods, initConfig, serviceProviders);
    return setPriority(methods);
};
