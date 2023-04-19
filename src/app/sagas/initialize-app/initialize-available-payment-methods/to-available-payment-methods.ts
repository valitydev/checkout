import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from 'checkout/state';
import {
    BankCard,
    DigitalWallet,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminal,
    ServiceProvider
} from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { bankCardToMethods } from './bank-card-to-methods';
import { getDigitalWalletPaymentMethods, getTerminalsPaymentMethods } from './get-payment-methods';
import { assertUnreachable } from 'checkout/utils';
import { terminalDigitalWalletReducer } from './terminal-digital-wallet-reducer';

export function toAvailablePaymentMethods(
    paymentMethods: PaymentMethod[],
    initConfig: InitConfig,
    serviceProviders: ServiceProvider[]
): PaymentMethodState[] {
    let result: PaymentMethodState[] = [];
    const {
        wallets,
        onlineBanking,
        netBanking,
        upi,
        terminalBankCard,
        terminalWallets,
        paymentFlowHold,
        recurring,
        pix
    } = initConfig;
    for (const method of paymentMethods) {
        switch (method.method) {
            case PaymentMethodName.BankCard:
                const bankCardMethods = bankCardToMethods(method as BankCard, initConfig);
                result = result.concat(bankCardMethods);
                break;
            case PaymentMethodName.DigitalWallet:
                result = result.concat(
                    getDigitalWalletPaymentMethods(
                        method as DigitalWallet,
                        serviceProviders,
                        wallets,
                        paymentFlowHold,
                        recurring
                    )
                );
                break;
            case PaymentMethodName.PaymentTerminal:
                result = result.concat(
                    getTerminalsPaymentMethods(method as PaymentTerminal, serviceProviders, {
                        onlineBanking,
                        netBanking,
                        upi,
                        terminalBankCard,
                        terminalWallets,
                        paymentFlowHold,
                        recurring,
                        pix
                    })
                );
                break;
            case PaymentMethodName.MobileCommerce:
                if (initConfig.mobileCommerce) {
                    result = result.concat([{ name: PaymentMethodNameState.MobileCommerce }]);
                }
                break;
            default:
                assertUnreachable(method.method);
        }
    }
    return result.reduce(terminalDigitalWalletReducer, []);
}
