import { createContext } from 'react';

import { PaymentCondition } from '../paymentCondition';

export type PaymentModelContextProps = {
    conditions: PaymentCondition[];
};

export const PaymentConditionsContext = createContext<PaymentModelContextProps>({
    conditions: null,
});
