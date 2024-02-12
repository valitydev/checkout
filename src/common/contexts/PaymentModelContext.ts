import { createContext } from 'react';

import { PaymentModel } from '../paymentModel';

export type PaymentModelContextProps = {
    readonly paymentModel: PaymentModel;
};

export const PaymentModelContext = createContext<PaymentModelContextProps>({
    paymentModel: null,
});
