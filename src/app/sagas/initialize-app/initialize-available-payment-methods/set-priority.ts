import {
    KnownProviderCategories,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminalPaymentMethod
} from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';

const getPriority = (method: PaymentMethod): number => {
    switch (method.name) {
        case PaymentMethodName.BankCard:
            return 1;
        case PaymentMethodName.PaymentTerminal:
            const { category } = method as PaymentTerminalPaymentMethod;
            switch (category) {
                case KnownProviderCategories.BankCard:
                    return 2;
                case KnownProviderCategories.OnlineBanking:
                    return 3;
                case KnownProviderCategories.NetBanking:
                    return 4;
                case KnownProviderCategories.UPI:
                    return 5;
                default:
                    assertUnreachable(category);
            }
        case PaymentMethodName.DigitalWallet:
            return 6;
        case PaymentMethodName.MobileCommerce:
        case PaymentMethodName.GooglePay:
        case PaymentMethodName.ApplePay:
        case PaymentMethodName.SamsungPay:
        case PaymentMethodName.YandexPay:
            return 7;
        default:
            assertUnreachable(method.name);
    }
};

export const setPriority = (methods: PaymentMethod[]): PaymentMethod[] =>
    methods.map((method) => ({
        ...method,
        priority: getPriority(method)
    }));
