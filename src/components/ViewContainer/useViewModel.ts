import { useCallback, useEffect, useReducer } from 'react';

import { SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentCondition, PaymentProcessed } from '../../common/paymentCondition';
import { PaymentMethod, PaymentModel } from '../../common/paymentModel';
import { formatAmount } from '../../common/utils';

type Action =
    | {
          type: 'SET_ACTIVE_VIEW';
          payload: ViewName;
      }
    | {
          type: 'ADD_VIEW';
          payload: View;
      }
    | {
          type: 'GO_TO';
          payload: {
              viewName: ViewName;
              direction: SlideAnimationDirection;
          };
      };

const dataReducer = (state: ViewModel, action: Action): ViewModel => {
    switch (action.type) {
        case 'SET_ACTIVE_VIEW':
            return {
                ...state,
                activeView: action.payload,
            };
        case 'ADD_VIEW':
            return {
                ...state,
                views: state.views.set(action.payload.name, action.payload),
            };
        default:
            return state;
    }
};

const toViews = (paymentMethods: PaymentMethod[]): Map<ViewName, View> => {
    let views = paymentMethods.reduce((acc, curr) => {
        switch (curr.name) {
            case 'BankCard':
            case 'PaymentTerminal':
                return acc.concat([['PaymentFormView', { name: 'PaymentFormView', paymentMethod: curr }]]);
            default:
                return acc;
        }
    }, []);
    if (views.length > 1) {
        views = views.concat([['PaymentMethodSelectorView', { name: 'PaymentMethodSelectorView' }]]);
    }
    return new Map<ViewName, View>(views);
};

const initViewModel = (model: PaymentModel, localeCode: string): ViewModel => {
    return {
        isLoading: false,
        direction: 'forward',
        viewAmount: formatAmount(model.paymentAmount, localeCode),
        views: toViews(model.paymentMethods),
    };
};

const toPaymentResultView = (model: PaymentModel, condition: PaymentProcessed): PaymentResultView => {
    return {
        name: 'PaymentResultView',
        iconName: 'Success',
        label: 'form.header.final.invoice.paid.label',
    };
};

const applyUninitialized = (model: PaymentModel): ViewName => {
    if (model.paymentMethods.length > 1) {
        return 'PaymentMethodSelectorView';
    }
    return 'PaymentFormView';
};

export const useViewModel = (localeCode: string, model: PaymentModel, condition: PaymentCondition) => {
    const [viewModel, dispatch] = useReducer(dataReducer, initViewModel(model, localeCode));

    useEffect(() => {
        switch (condition.name) {
            case 'uninitialized':
                const uninitializedPayload = applyUninitialized(model);
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: uninitializedPayload });
                break;
            case 'processed':
                const resultView = toPaymentResultView(model, condition);
                dispatch({ type: 'ADD_VIEW', payload: resultView });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'PaymentResultView' });
                break;
        }
    }, [condition]);

    const goTo = useCallback((viewName: ViewName, direction: SlideAnimationDirection = 'forward') => {
        dispatch({ type: 'GO_TO', payload: { viewName, direction } });
    }, []);

    return { viewModel, goTo };
};
