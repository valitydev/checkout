import { InitConfig } from 'checkout/config';
import { toAvailablePaymentMethods } from './to-available-payment-methods';
import { setPriority } from './set-priority';
import { Model } from '../fetch-model';

export const initAvailablePaymentMethods = (initConfig: InitConfig, { paymentMethods, serviceProviders }: Model) => {
    const methods = toAvailablePaymentMethods(paymentMethods, initConfig, serviceProviders);
    return setPriority(methods);
};
