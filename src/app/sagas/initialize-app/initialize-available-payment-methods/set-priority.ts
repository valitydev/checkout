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
                case KnownProviderCategories.OnlineBanking:
                    return 2;
                case KnownProviderCategories.NetBanking:
                    return 3;
                case KnownProviderCategories.UPI:
                    return 4;
                default:
                    assertUnreachable(category);
            }
        case PaymentMethodName.DigitalWallet:
            return 5;
        case PaymentMethodName.MobileCommerce:
        case PaymentMethodName.GooglePay:
        case PaymentMethodName.ApplePay:
        case PaymentMethodName.SamsungPay:
        case PaymentMethodName.YandexPay:
            return 6;
        default:
            assertUnreachable(method.name);
    }
};

export const setPriority = (methods: PaymentMethod[]): PaymentMethod[] =>
    methods.map((method) => ({
        ...method,
        priority: getPriority(method)
    }));
