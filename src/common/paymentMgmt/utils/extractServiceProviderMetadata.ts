import { CheckoutServiceProviderMetadata } from 'checkout/backend';

import { PaymentMethod, TerminalServiceProvider } from '../../paymentModel';
import { getMetadata, isNil } from '../../utils';
import { StartPaymentPayload } from '../types';

export const extractServiceProviderMetadata = (
    paymentMethods: PaymentMethod[],
    { methodName, values }: StartPaymentPayload,
): CheckoutServiceProviderMetadata => {
    if (methodName === 'PaymentTerminal') {
        const payloadProviderId = values.provider;
        const { metadata } = paymentMethods.reduce((result, paymentMethod) => {
            if (!isNil(result) || paymentMethod.name !== 'PaymentTerminal') {
                return result;
            }
            return paymentMethod.providers.find(({ id }) => id === payloadProviderId);
        }, null as TerminalServiceProvider);
        return getMetadata(metadata);
    }
    return {};
};
