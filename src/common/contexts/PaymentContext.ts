import { createContext } from 'react';

import { PaymentCondition } from '../paymentCondition';
import { PaymentModel } from '../paymentModel';

export type PaymentPayload = Record<string, any>;

export type PaymentModelContextProps = {
    paymentModel: PaymentModel;
    paymentCondition: PaymentCondition;
    startPayment: (payload: PaymentPayload) => void;
};

export const PaymentContext = createContext<PaymentModelContextProps>({
    paymentModel: null,
    paymentCondition: null,
    startPayment: () => {},
});
