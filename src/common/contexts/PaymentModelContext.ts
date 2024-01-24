import { createContext } from 'react';

import { PaymentModelChange } from '../../components/GlobalContainer/usePaymentModel';
import { PaymentModel } from '../paymentModel';

export type PaymentPayload = Record<string, any>;

export type PaymentModelContextProps = {
    initPaymentModel: PaymentModel;
    paymentModelChange: PaymentModelChange | null;
    startPayment: (payload: PaymentPayload) => void;
};

export const PaymentModelContext = createContext<PaymentModelContextProps>({
    initPaymentModel: null,
    paymentModelChange: null,
    startPayment: () => {},
});
