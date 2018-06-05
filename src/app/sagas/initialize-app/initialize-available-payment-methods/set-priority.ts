import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from 'checkout/state';

export const setPriority = (methods: PaymentMethodState[]): PaymentMethodState[] =>
    methods.map((method) => {
        switch (method.name) {
            case PaymentMethodNameState.ApplePay:
                return {
                    ...method,
                    priority: 1
                };
            case PaymentMethodNameState.SamsungPay:
                return {
                    ...method,
                    priority: 1
                };
            case PaymentMethodNameState.GooglePay:
                return {
                    ...method,
                    priority: 2
                };
            case PaymentMethodNameState.BankCard:
                return {
                    ...method,
                    priority: 3
                };
            case PaymentMethodNameState.DigitalWallet:
                return {
                    ...method,
                    priority: 4
                };
            case PaymentMethodNameState.PaymentTerminal:
                return {
                    ...method,
                    priority: 5
                };
        }
    });