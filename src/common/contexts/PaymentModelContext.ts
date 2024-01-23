import { createContext } from 'react';

import { PaymentModel } from '../hooks';

export type PaymentPayload = Record<string, any>;

export type PaymentModelContextProps = {
    model: PaymentModel | null;
    startPayment: (payload: PaymentPayload) => void;
};

export const PaymentModelContext = createContext<PaymentModelContextProps>({
    model: null,
    startPayment: () => {},
});
