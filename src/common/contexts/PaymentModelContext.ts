import { createContext } from 'react';

import { PaymentModel } from '../paymentModel';

export type PaymentPayload = Record<string, any>;

export type PaymentModelContextProps = {
    model: PaymentModel | null;
    startPayment: (payload: PaymentPayload) => void;
};

export const PaymentModelContext = createContext<PaymentModelContextProps>({
    model: null,
    startPayment: () => {},
});
