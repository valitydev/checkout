import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from 'checkout/state';
import { BankCard } from 'checkout/backend';
import { InitConfig } from 'checkout/config';

export function bankCardToMethods(bankCard: BankCard, initConfig: InitConfig): PaymentMethodState[] {
    const { tokenProviders } = bankCard;
    let result: PaymentMethodState[] = [];
    if (tokenProviders && tokenProviders.length > 0) {
        result = result.concat([]);
    } else if (initConfig.bankCard) {
        result.push({ name: PaymentMethodNameState.BankCard });
    }
    return result;
}
