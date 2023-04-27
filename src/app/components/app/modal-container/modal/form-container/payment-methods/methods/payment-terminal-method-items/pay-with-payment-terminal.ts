import { PaymentMethodName } from 'checkout/backend';
import { PaymentTerminalFormValues } from 'checkout/state';
import { PayAction } from './types';
import { AppContext } from 'checkout/actions';

export const payWithPaymentTerminal = (context: AppContext, provider: string, pay: PayAction) =>
    pay({
        method: PaymentMethodName.PaymentTerminal,
        values: {
            provider
        } as PaymentTerminalFormValues,
        context
    });
