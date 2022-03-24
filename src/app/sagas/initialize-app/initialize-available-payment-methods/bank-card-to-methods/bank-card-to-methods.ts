import { call, CallEffect } from 'redux-saga/effects';
import {
    ConfigState,
    PaymentMethod as PaymentMethodState,
    PaymentMethodName as PaymentMethodNameState
} from 'checkout/state';
import { BankCard } from 'checkout/backend';
import { tokenProvidersToMethods } from './token-providers-to-methods';

export function* bankCardToMethods(
    bankCard: BankCard,
    config: ConfigState
): Iterator<CallEffect | PaymentMethodState[]> {
    const { tokenProviders } = bankCard;
    let result: PaymentMethodState[] = [];
    if (tokenProviders && tokenProviders.length > 0) {
        result = result.concat(yield call(tokenProvidersToMethods, tokenProviders, config));
    } else if (config.initConfig.bankCard) {
        result.push({ name: PaymentMethodNameState.BankCard });
    }
    return result;
}
