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
    PaymentTerminalPaymentMethod,
    KnownProviderCategories,
    PaymentTerminalBankCardFormInfo,
    PaymentTerminalFormInfo,
    InstantTerminalPaymentFormInfo
} from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { assertUnreachable } from 'checkout/utils';
import { getMetadata } from 'checkout/components';

const toPaymentTerminalForms = ({ category, serviceProviders }: PaymentTerminalPaymentMethod) => {
    switch (category) {
        case KnownProviderCategories.OnlineBanking:
            if (serviceProviders.length === 1) {
                const { form } = getMetadata(serviceProviders[0]);
                return isNil(form)
                    ? new InstantTerminalPaymentFormInfo(category)
                    : new PaymentTerminalFormInfo(category);
            }
            return new OnlineBankingFormInfo(category);
        case KnownProviderCategories.BankCard:
            return new PaymentTerminalBankCardFormInfo();
        case KnownProviderCategories.DigitalWallet:
        case KnownProviderCategories.NetBanking:
        case KnownProviderCategories.UPI:
            return new InstantTerminalPaymentFormInfo(category);
        case KnownProviderCategories.PIX:
            return new PaymentTerminalFormInfo(category);
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
