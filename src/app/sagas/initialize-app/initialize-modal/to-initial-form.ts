import isNil from 'lodash-es/isNil';

import {
    CardFormInfo,
    FormInfo,
    PaymentMethod,
    PaymentMethodName,
    MobileCommerceFormInfo,
    WalletFormInfo,
    TokenProviderFormInfo,
    NoAvailablePaymentMethodFormInfo,
    DigitalWalletPaymentMethod,
    WalletProvidersFormInfo,
    OnlineBankingFormInfo,
    UPIFormInfo,
    PaymentTerminalPaymentMethod,
    KnownProviderCategories,
    PaymentTerminalBankCardFormInfo,
    PaymentMethodsFormInfo
} from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { assertUnreachable } from 'checkout/utils';

const toPaymentTerminalForms = ({ category, serviceProviders }: PaymentTerminalPaymentMethod) => {
    switch (category) {
        case KnownProviderCategories.OnlineBanking:
        case KnownProviderCategories.NetBanking:
            return serviceProviders.length === 1 ? new PaymentMethodsFormInfo() : new OnlineBankingFormInfo(category);
        case KnownProviderCategories.UPI:
            return isNil(serviceProviders[0].metadata) ? new PaymentMethodsFormInfo() : new UPIFormInfo();
        case KnownProviderCategories.BankCard:
            return new PaymentTerminalBankCardFormInfo();
        case KnownProviderCategories.DigitalWallet:
            return new PaymentMethodsFormInfo();
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
        case PaymentMethodName.ApplePay:
            return new TokenProviderFormInfo(BankCardTokenProvider.applepay);
        case PaymentMethodName.GooglePay:
            return new TokenProviderFormInfo(BankCardTokenProvider.googlepay);
        case PaymentMethodName.SamsungPay:
            return new TokenProviderFormInfo(BankCardTokenProvider.samsungpay);
        case PaymentMethodName.YandexPay:
            return new TokenProviderFormInfo(BankCardTokenProvider.yandexpay);
        case PaymentMethodName.MobileCommerce:
            return new MobileCommerceFormInfo();
        case PaymentMethodName.DigitalWallet:
            return toDigitalWalletForms(method as DigitalWalletPaymentMethod);
        case PaymentMethodName.PaymentTerminal:
            return toPaymentTerminalForms(method as PaymentTerminalPaymentMethod);
        default:
            assertUnreachable(method.name);
            return new NoAvailablePaymentMethodFormInfo();
    }
};
