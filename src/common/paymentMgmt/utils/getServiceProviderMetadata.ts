import { CheckoutServiceProviderMetadata } from 'checkout/backend';

import { PaymentMethod, TerminalServiceProvider } from '../../paymentModel';
import { getMetadata, isNil } from '../../utils';

export const getServiceProviderMetadata = (
    paymentMethods: PaymentMethod[],
    providerId: string,
): CheckoutServiceProviderMetadata => {
    if (isNil(paymentMethods) || isNil(providerId)) {
        return {};
    }
    const { metadata } = paymentMethods.reduce((result, paymentMethod) => {
        if (!isNil(result) || paymentMethod.name !== 'PaymentTerminal') {
            return result;
        }
        return paymentMethod.providers.find(({ id }) => id === providerId);
    }, null as TerminalServiceProvider);
    return getMetadata(metadata);
};
