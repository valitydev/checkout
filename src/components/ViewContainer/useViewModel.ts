import { useCallback, useEffect, useReducer } from 'react';

import { PaymentFormView, PaymentResultView, SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentModel } from '../../common/paymentModel';
import { PaymentModelChange } from '../GlobalContainer/usePaymentModel';

type Action =
    | {
          type: 'SET_VIEW_MODEL';
          payload: ViewModel;
      }
    | {
          type: 'GO_TO';
          payload: {
              viewName: ViewName;
              direction: SlideAnimationDirection;
          };
      }
    | {
          type: 'SET_IS_LOADING';
          payload: boolean;
      };

const dataReducer = (state: ViewModel, action: Action): ViewModel => {
    switch (action.type) {
        case 'SET_VIEW_MODEL':
            return {
                ...action.payload,
            };
        case 'GO_TO':
            return {
                ...state,
            };
        case 'SET_IS_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

const paymentFormView: PaymentFormView = {
    name: 'PaymentFormView',
};
const paymentResultView: PaymentResultView = {
    name: 'PaymentResultView',
    iconName: 'Success',
    label: 'form.header.final.invoice.paid.label',
};

const toActiveView = (paymentModel: PaymentModel): View => {
    switch (paymentModel.paymentState.name) {
        case 'uninitialized':
            return paymentResultView;
        case 'processed':
            return paymentResultView;
    }
};

const toViewModel = (paymentModel: PaymentModel): ViewModel => {
    const result: ViewModel = {
        activeView: toActiveView(paymentModel),
        direction: 'forward',
        isLoading: false,
        viewAmount: 'RUB 1000',
        views: new Map<any, any>([
            ['PaymentFormView', paymentFormView],
            ['PaymentResultView', paymentResultView],
        ]),
    };
    return result;
};

export const useViewModel = (initModel: PaymentModel, modelChange: PaymentModelChange) => {
    const [viewModel, dispatch] = useReducer(dataReducer, toViewModel(initModel));

    useEffect(() => {
        if (modelChange.status === 'PAYMENT_STATE_CHANGED') {
            const payload = toViewModel({ paymentState: modelChange.paymentState } as any);
            dispatch({ type: 'SET_VIEW_MODEL', payload });
        }
    }, [modelChange]);

    const goTo = useCallback((viewName: ViewName, direction: SlideAnimationDirection = 'forward') => {
        dispatch({ type: 'GO_TO', payload: { viewName, direction } });
    }, []);

    const setIsLoading = useCallback((isLoading: boolean) => {
        dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
    }, []);

    return { viewModel, goTo, setIsLoading };
};
