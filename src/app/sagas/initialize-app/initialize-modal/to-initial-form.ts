import { logPrefix } from 'checkout/log-messages';
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
    WalletProvidersFormInfo
} from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { assertUnreachable } from 'checkout/utils';
import isArray from 'lodash-es/isArray';

// TODO rename function
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
        case PaymentMethodName.DigitalWallet:
            if (isArray(method.providers)) {
                return new WalletProvidersFormInfo();
            }
            return new WalletFormInfo();
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
        default:
            assertUnreachable(method.name);
            console.error(`${logPrefix} Unsupported initial form for method ${method}`);
            return new NoAvailablePaymentMethodFormInfo();
    }
};
