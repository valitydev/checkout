import { useReducer } from 'react';

import { PaymentFormViewModel } from './types';
import { ViewModel } from '../types';

const toPaymentFormViewModel = (viewModel: ViewModel): PaymentFormViewModel => {
    const result: PaymentFormViewModel = {
        name: 'cardForm',
        viewAmount: 'RUB 1000',
    };
    console.log('toPaymentFormViewModel: ViewModel -> PaymentFormViewModel', viewModel, result);
    return result;
};

type Action = {
    type: 'ACTION_NAME';
};

const dataReducer = (state: PaymentFormViewModel, action: Action): PaymentFormViewModel => {
    switch (action.type) {
        default:
            return state;
    }
};

export const usePaymentFormViewModel = (viewModel: ViewModel) => {
    const [paymentFormViewModel] = useReducer(dataReducer, toPaymentFormViewModel(viewModel));

    return { paymentFormViewModel };
};
