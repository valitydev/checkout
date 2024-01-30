import { useCallback, useEffect, useReducer } from 'react';

import { PaymentResultView, SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentCondition, PaymentProcessed, PaymentFailed } from '../../common/paymentCondition';
import { PaymentMethod, PaymentModel } from '../../common/paymentModel';
import { formatAmount } from '../../common/utils';

type Action =
    | {
          type: 'SET_ACTIVE_VIEW';
          payload: ViewName;
      }
    | {
          type: 'SET_VIEW';
          payload: View;
      }
    | {
          type: 'SET_LOADING';
          payload: boolean;
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
        case 'SET_VIEW':
            return {
                ...state,
                views: state.views.set(action.payload.name, action.payload),
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

const toViews = ({ paymentMethods, initContext }: PaymentModel): Map<ViewName, View> => {
    let views = paymentMethods.reduce<[ViewName, View][]>((acc, paymentMethod) => {
        switch (paymentMethod.name) {
            case 'BankCard':
                return acc.concat([['PaymentFormView', { name: 'PaymentFormView', paymentMethod, initContext }]]);
            case 'PaymentTerminal':
                if (paymentMethod.providers.length === 1) {
                    return acc.concat([['PaymentFormView', { name: 'PaymentFormView', paymentMethod, initContext }]]);
                }
                return acc.concat([
                    ['TerminalSelectorView', { name: 'TerminalSelectorView', paymentMethod: paymentMethod }],
                ]);
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
        views: toViews(model),
    };
};

const applyPaymentProcessed = (condition: PaymentProcessed): PaymentResultView => {
    return {
        name: 'PaymentResultView',
        iconName: 'Success',
        label: 'form.header.final.invoice.paid.label',
    };
};

const applyPaymentFailed = (condition: PaymentFailed): PaymentResultView => {
    return {
        name: 'PaymentResultView',
        iconName: 'Error',
        label: 'form.header.final.failed.label',
        description: condition.error.code,
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
                dispatch({ type: 'SET_LOADING', payload: false });
                dispatch({ type: 'SET_VIEW', payload: applyPaymentProcessed(condition) });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'PaymentResultView' });
                break;
            case 'paymentFailed':
                dispatch({ type: 'SET_LOADING', payload: false });
                dispatch({ type: 'SET_VIEW', payload: applyPaymentFailed(condition) });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'PaymentResultView' });
                break;
            case 'pending':
                dispatch({ type: 'SET_LOADING', payload: true });
                break;
        }
    }, [condition]);

    const goTo = useCallback((viewName: ViewName, direction: SlideAnimationDirection = 'forward') => {
        dispatch({ type: 'GO_TO', payload: { viewName, direction } });
    }, []);

    return { viewModel, goTo };
};
