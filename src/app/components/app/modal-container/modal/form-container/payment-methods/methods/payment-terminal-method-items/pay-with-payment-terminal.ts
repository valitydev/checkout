import { PaymentMethodName } from 'checkout/backend';
import { PaymentTerminalFormValues } from 'checkout/state';
import { PayAction } from './types';

export const payWithPaymentTerminal = (provider: string, pay: PayAction) =>
    pay({
        method: PaymentMethodName.PaymentTerminal,
        values: {
            provider
        } as PaymentTerminalFormValues
    });
