import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from 'checkout/state';
import { InitConfig } from 'checkout/config';

export function bankCardToMethods(initConfig: InitConfig): PaymentMethodState[] {
    let result: PaymentMethodState[] = [];
    if (initConfig.bankCard) {
        result.push({ name: PaymentMethodNameState.BankCard });
    }
    return result;
}
