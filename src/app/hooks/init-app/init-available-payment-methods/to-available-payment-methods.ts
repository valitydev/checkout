import { DigitalWallet, PaymentMethod, PaymentMethodName, PaymentTerminal, ServiceProvider } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { assertUnreachable } from 'checkout/utils';

import { bankCardToMethods } from './bank-card-to-methods';
import { getDigitalWalletPaymentMethods, getTerminalsPaymentMethods } from './get-payment-methods';
import { terminalDigitalWalletReducer } from './terminal-digital-wallet-reducer';
import { PaymentMethod as PaymentMethodState } from './types';

export function toAvailablePaymentMethods(
    paymentMethods: PaymentMethod[],
    initConfig: InitConfig,
    serviceProviders: ServiceProvider[],
): PaymentMethodState[] {
    let result: PaymentMethodState[] = [];
    const { wallets, onlineBanking, netBanking, upi, terminalWallets, paymentFlowHold, recurring, pix } = initConfig;
    for (const method of paymentMethods) {
        switch (method.method) {
            case PaymentMethodName.BankCard:
                const bankCardMethods = bankCardToMethods(initConfig);
                result = result.concat(bankCardMethods);
                break;
            case PaymentMethodName.DigitalWallet:
                result = result.concat(
                    getDigitalWalletPaymentMethods(
                        method as DigitalWallet,
                        serviceProviders,
                        wallets,
                        paymentFlowHold,
                        recurring,
                    ),
                );
                break;
            case PaymentMethodName.PaymentTerminal:
                result = result.concat(
                    getTerminalsPaymentMethods(method as PaymentTerminal, serviceProviders, {
                        onlineBanking,
                        netBanking,
                        upi,
                        terminalWallets,
                        paymentFlowHold,
                        recurring,
                        pix,
                    }),
                );
                break;
            default:
                assertUnreachable(method.method);
        }
    }
    return result.reduce(terminalDigitalWalletReducer, []);
}
