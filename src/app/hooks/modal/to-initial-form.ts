import {
    DigitalWalletPaymentMethod,
    KnownProviderCategories,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminalPaymentMethod,
} from 'checkout/hooks';
import { assertUnreachable } from 'checkout/utils';

import {
    CardFormInfo,
    FormInfo,
    WalletFormInfo,
    NoAvailablePaymentMethodFormInfo,
    WalletProvidersFormInfo,
    PaymentTerminalFormInfo,
    PaymentTerminalSelectorFormInfo,
} from './types';

const toPaymentTerminalForms = ({ category, serviceProviders }: PaymentTerminalPaymentMethod) => {
    switch (category) {
        case KnownProviderCategories.DigitalWallet:
        case KnownProviderCategories.NetBanking:
        case KnownProviderCategories.UPI:
        case KnownProviderCategories.PIX:
        case KnownProviderCategories.PaymentTerminal:
        case KnownProviderCategories.OnlineBanking:
            if (serviceProviders.length === 1) {
                return new PaymentTerminalFormInfo(serviceProviders[0].id);
            }
            return new PaymentTerminalSelectorFormInfo(category);
        default:
            assertUnreachable(category);
            return null;
    }
};

const toDigitalWalletForms = ({ serviceProviders }: DigitalWalletPaymentMethod) =>
    serviceProviders.length === 1 ? new WalletFormInfo(serviceProviders[0]) : new WalletProvidersFormInfo();

export const toInitialForm = (method: PaymentMethod): FormInfo => {
    switch (method.name) {
        case PaymentMethodName.BankCard:
            return new CardFormInfo();
        case PaymentMethodName.DigitalWallet:
            return toDigitalWalletForms(method as DigitalWalletPaymentMethod);
        case PaymentMethodName.PaymentTerminal:
            return toPaymentTerminalForms(method as PaymentTerminalPaymentMethod);
        default:
            assertUnreachable(method.name);
            return new NoAvailablePaymentMethodFormInfo();
    }
};
