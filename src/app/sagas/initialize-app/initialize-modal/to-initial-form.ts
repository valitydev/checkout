import {
    CardFormInfo,
    FormInfo,
    PaymentMethod,
    PaymentMethodName,
    MobileCommerceFormInfo,
    EurosetFormInfo,
    WalletFormInfo,
    TokenProviderFormInfo,
    QPSFormInfo,
    UzcardFormInfo,
    NoAvailablePaymentMethodFormInfo,
    DigitalWalletPaymentMethod,
    WalletProvidersFormInfo,
    OnlineBankingFormInfo,
    UPIFormInfo,
    PaymentTerminalPaymentMethod,
    KnownProviderCategories
} from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { assertUnreachable } from 'checkout/utils';

export const toInitialForm = (method: PaymentMethod): FormInfo => {
    switch (method.name) {
        case PaymentMethodName.BankCard:
            return new CardFormInfo();
        case PaymentMethodName.Euroset:
            return new EurosetFormInfo();
        case PaymentMethodName.Uzcard:
            return new UzcardFormInfo();
        case PaymentMethodName.QPS:
            return new QPSFormInfo();
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
            const { category, serviceProviders } = method as PaymentTerminalPaymentMethod;
            switch (category) {
                case KnownProviderCategories.OnlineBanking:
                case KnownProviderCategories.NetBanking:
                    return new OnlineBankingFormInfo(category);
                case KnownProviderCategories.UPI:
                    return new UPIFormInfo(serviceProviders[0]);
                default:
                    assertUnreachable(category);
            }
            break;
        default:
            assertUnreachable(method.name);
            return new NoAvailablePaymentMethodFormInfo();
    }
};
