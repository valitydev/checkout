import { useReducer } from 'react';

import { PaymentFormViewModel } from './types';
import { ViewModel } from '../types';

const toPaymentFormViewModel = (viewModel: ViewModel): PaymentFormViewModel => {
    const view = viewModel.views.get(viewModel.activeView);
    if (view.name !== 'PaymentFormView') {
        throw new Error(`Wrong View. Expected: PaymentFormView, actual: ${view.name}`);
    }
    switch (view.paymentMethod.name) {
        case 'BankCard':
            return {
                name: 'CardForm',
                viewAmount: viewModel.viewAmount,
                formTitle: 'form.header.pay.card.label',
            };
        case 'PaymentTerminal':
            throw new Error('Unimplemented PaymentTerminal View');
    }
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
