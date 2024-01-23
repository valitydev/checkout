import { useCallback, useReducer } from 'react';

import { PaymentFormView, PaymentResultView, SlideAnimationDirection, ViewModel, ViewName } from './types';
import { PaymentModel } from '../../common/hooks';

type Action = {
    type: 'GO_TO';
    payload: {
        viewName: ViewName;
        direction: SlideAnimationDirection;
    };
};

const dataReducer = (state: ViewModel, action: Action): ViewModel => {
    switch (action.type) {
        case 'GO_TO':
            return {
                ...state,
            };
        default:
            return state;
    }
};

const toViewModel = (paymentModel: PaymentModel): ViewModel => {
    const paymentFormView: PaymentFormView = {
        name: 'paymentFormView',
    };
    const paymentResultView: PaymentResultView = {
        name: 'paymentResultView',
    };
    const result: ViewModel = {
        activeView: paymentFormView,
        direction: 'forward',
        isLoading: false,
        viewAmount: 'RUB 1000',
        views: [paymentFormView, paymentResultView],
    };
    console.log('toViewModel: PaymentModel -> ViewModel', paymentModel, result);
    return result;
};

export const useViewModel = (paymentModel: PaymentModel) => {
    const [viewModel, dispatch] = useReducer(dataReducer, toViewModel(paymentModel));

    const goTo = useCallback((viewName: ViewName, direction: SlideAnimationDirection = 'forward') => {
        dispatch({ type: 'GO_TO', payload: { viewName, direction } });
    }, []);

    return { viewModel, goTo };
};
