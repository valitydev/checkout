import { useCallback, useEffect, useReducer } from 'react';

import { SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentCondition, PaymentProcessed, PaymentUninitialized } from '../../common/paymentCondition';
import { PaymentModel } from '../../common/paymentModel';
import { formatAmount } from '../../common/utils';

type Action =
    | {
          type: 'SET_ACTIVE_VIEW';
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
                views: state.views.set(action.payload.name, action.payload),
            };
        default:
            return state;
    }
};

const initViewModel = (model: PaymentModel, localeCode: string): ViewModel => {
    return {
        isLoading: false,
        direction: 'forward',
        viewAmount: formatAmount(model.paymentAmount, localeCode),
        views: new Map<ViewName, View>(),
    };
};

const applyProcessed = (model: PaymentModel, condition: PaymentProcessed): View => {
    return {
        name: 'PaymentResultView',
        iconName: 'Success',
        label: 'form.header.final.invoice.paid.label',
    };
};

const applyUninitialized = (model: PaymentModel, condition: PaymentUninitialized): View => {
    return {
        name: 'PaymentFormView',
    };
};

export const useViewModel = (localeCode: string, model: PaymentModel, condition: PaymentCondition) => {
    const [viewModel, dispatch] = useReducer(dataReducer, initViewModel(model, localeCode));

    useEffect(() => {
        switch (condition.name) {
            case 'uninitialized':
                const uninitializedPayload = applyUninitialized(model, condition);
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: uninitializedPayload });
                break;
            case 'processed':
                const processedPayload = applyProcessed(model, condition);
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: processedPayload });
                break;
        }
    }, [condition]);

    const goTo = useCallback((viewName: ViewName, direction: SlideAnimationDirection = 'forward') => {
        dispatch({ type: 'GO_TO', payload: { viewName, direction } });
    }, []);

    return { viewModel, goTo };
};
