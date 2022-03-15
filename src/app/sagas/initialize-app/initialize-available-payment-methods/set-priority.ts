import { PaymentMethod, PaymentMethodName } from 'checkout/state';

const paymentMethodPriorityDesc: PaymentMethodName[] = [
    PaymentMethodName.BankCard,
    PaymentMethodName.ApplePay,
    PaymentMethodName.OnlineBanking,
    PaymentMethodName.NetBanking,
    PaymentMethodName.UPI,
    PaymentMethodName.DigitalWallet,
    PaymentMethodName.MobileCommerce,
    PaymentMethodName.GooglePay,
    PaymentMethodName.YandexPay,
    PaymentMethodName.SamsungPay
];

export const setPriority = (methods: PaymentMethod[]): PaymentMethod[] =>
    methods.map((method) => ({
        ...method,
        priority: paymentMethodPriorityDesc.findIndex((m) => m === method.name) + 1
    }));
