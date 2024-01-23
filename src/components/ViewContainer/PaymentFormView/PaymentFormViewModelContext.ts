import { createContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { PaymentFormViewModel } from './types';

export type PaymentFormViewModelContextProps = {
    paymentFormViewModel: PaymentFormViewModel | null;
    onSubmitForm: <TFieldValues extends FieldValues>(data: TFieldValues) => void;
};

export const PaymentFormViewModelContext = createContext<PaymentFormViewModelContextProps>({
    paymentFormViewModel: null,
    onSubmitForm: () => {},
});
