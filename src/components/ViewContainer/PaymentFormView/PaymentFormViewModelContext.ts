import { createContext } from 'react';

import { PaymentFormViewModel } from './types';

export type PaymentFormViewModelContextProps = {
    paymentFormViewModel: PaymentFormViewModel | null;
};

export const PaymentFormViewModelContext = createContext<PaymentFormViewModelContextProps>({
    paymentFormViewModel: null,
});
