import { createContext } from 'react';

export type PaymentPayload = Record<string, any>;

export type PaymentModelContextProps = {
    startPayment: (payload: PaymentPayload) => void;
    startWaitingPaymentResult: () => void;
};

export const PaymentContext = createContext<PaymentModelContextProps>({
    startPayment: () => {},
    startWaitingPaymentResult: () => {},
});
