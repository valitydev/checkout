import { InitConfig } from 'checkout/config';

import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from '../types';

export function bankCardToMethods(initConfig: InitConfig): PaymentMethodState[] {
    const result: PaymentMethodState[] = [];
    if (initConfig.bankCard) {
        result.push({ name: PaymentMethodNameState.BankCard });
    }
    return result;
}
