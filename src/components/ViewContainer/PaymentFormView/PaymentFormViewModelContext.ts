import { createContext } from 'react';

import { PaymentFormViewModel, SubmitFormValues } from './types';

export type PaymentFormViewModelContextProps = {
    paymentFormViewModel: PaymentFormViewModel | null;
    onSubmitForm: (data: SubmitFormValues) => void;
};

export const PaymentFormViewModelContext = createContext<PaymentFormViewModelContextProps>({
    paymentFormViewModel: null,
    onSubmitForm: () => {},
});
