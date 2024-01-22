import { createContext } from 'react';

import { PaymentModel } from '../hooks';

export type PaymentModelContextProps = {
    model: PaymentModel | null;
};

export const PaymentModelContext = createContext<PaymentModelContextProps>({
    model: null,
});
