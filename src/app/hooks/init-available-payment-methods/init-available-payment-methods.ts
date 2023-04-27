import { PaymentMethod, ServiceProvider } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { toAvailablePaymentMethods } from './to-available-payment-methods';
import { setPriority } from './set-priority';

export const initAvailablePaymentMethods = (
    initConfig: InitConfig,
    paymentMethods: PaymentMethod[],
    serviceProviders: ServiceProvider[]
) => {
    const methods = toAvailablePaymentMethods(paymentMethods, initConfig, serviceProviders);
    return setPriority(methods);
};
