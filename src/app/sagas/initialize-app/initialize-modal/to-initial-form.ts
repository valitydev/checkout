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
    PaymentTerminalBankCardFormInfo
} from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { assertUnreachable } from 'checkout/utils';

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
            const { providers } = method as DigitalWalletPaymentMethod;
            if (providers.length === 1) {
                return new WalletFormInfo(providers[0]);
            }
            return new WalletProvidersFormInfo();
        case PaymentMethodName.PaymentTerminal:
            const { category } = method as PaymentTerminalPaymentMethod;
            switch (category) {
                case KnownProviderCategories.OnlineBanking:
                case KnownProviderCategories.NetBanking:
                    return new OnlineBankingFormInfo(category);
                case KnownProviderCategories.UPI:
                    return new UPIFormInfo(category);
                case KnownProviderCategories.BankCard:
                    return new PaymentTerminalBankCardFormInfo(category);
                default:
                    assertUnreachable(category);
            }
            break;
        default:
            assertUnreachable(method.name);
            return new NoAvailablePaymentMethodFormInfo();
    }
};
