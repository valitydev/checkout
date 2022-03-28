import { call, CallEffect } from 'redux-saga/effects';
import {
    AmountInfoState,
    PaymentMethod as PaymentMethodState,
    PaymentMethodName as PaymentMethodNameState
} from 'checkout/state';
import { DigitalWallet, PaymentMethod, PaymentMethodName, ServiceProvider } from 'checkout/backend';
import { Config } from 'checkout/config';
import { bankCardToMethods } from './bank-card-to-methods';
import { getDigitalWalletPaymentMethods, getTerminalsPaymentMethods } from './get-payment-methods';
import { assertUnreachable } from 'checkout/utils';

export function* toAvailablePaymentMethods(
    paymentMethods: PaymentMethod[],
    config: Config,
    amountInfo: AmountInfoState,
    serviceProviders: ServiceProvider[]
): Iterator<CallEffect | PaymentMethodState[]> {
    let result: PaymentMethodState[] = [];
    const {
        wallets,
        onlineBanking,
        netBanking,
        upi,
        paymentTerminalBankCard,
        paymentFlowHold,
        recurring
    } = config.initConfig;
    for (const method of paymentMethods) {
        switch (method.method) {
            case PaymentMethodName.BankCard:
                const bankCardMethods = yield call(bankCardToMethods, method as any, config, amountInfo);
                result = result.concat(bankCardMethods);
                break;
            case PaymentMethodName.DigitalWallet:
                result = result.concat(
                    getDigitalWalletPaymentMethods(method as DigitalWallet, wallets, paymentFlowHold, recurring)
                );
                break;
            case PaymentMethodName.PaymentTerminal:
                result = result.concat(
                    getTerminalsPaymentMethods(serviceProviders, {
                        onlineBanking,
                        netBanking,
                        upi,
                        paymentTerminalBankCard,
                        paymentFlowHold,
                        recurring
                    })
                );
                break;
            case PaymentMethodName.MobileCommerce:
                if (config.initConfig.mobileCommerce) {
                    result = result.concat([{ name: PaymentMethodNameState.MobileCommerce }]);
                }
                break;
            default:
                assertUnreachable(method.method);
        }
    }
    return result;
}
