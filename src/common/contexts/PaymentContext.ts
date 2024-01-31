import { createContext } from 'react';

import { PaymentCondition } from '../paymentCondition';

export type PaymentPayload = Record<string, any>;

export type PaymentModelContextProps = {
    paymentCondition: PaymentCondition;
    startPayment: (payload: PaymentPayload) => void;
};

export const PaymentContext = createContext<PaymentModelContextProps>({
    paymentCondition: null,
    startPayment: () => {},
});
