import { useCallback, useEffect, useReducer } from 'react';

import { SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentCondition } from '../../common/paymentCondition';
import { PaymentModel } from '../../common/paymentModel';

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

const toViews = ({ paymentMethods }: PaymentModel): Map<ViewName, View> => {
    let views = paymentMethods.reduce<[ViewName, View][]>((acc, paymentMethod) => {
        const { methodName } = paymentMethod;
        switch (methodName) {
            case 'BankCard':
                return acc.concat([['PaymentFormView', { name: 'PaymentFormView', methodName }]]);
            case 'PaymentTerminal':
                const { providers } = paymentMethod;
                if (providers.length === 1) {
                    return acc.concat([
                        ['PaymentFormView', { name: 'PaymentFormView', methodName, provider: providers[0] }],
                    ]);
                }
                return acc.concat([['TerminalSelectorView', { name: 'TerminalSelectorView', providers }]]);
            default:
                return acc;
        }
    }, []);
    if (views.length > 1) {
        views = views.concat([['PaymentMethodSelectorView', { name: 'PaymentMethodSelectorView' }]]);
    }
    return new Map<ViewName, View>(views);
};

const initViewModel = (model: PaymentModel): ViewModel => {
    return {
        isLoading: false,
        direction: 'forward',
        views: toViews(model),
    };
};

const applyUninitialized = (model: PaymentModel): ViewName => {
    if (model.paymentMethods.length > 1) {
        return 'PaymentMethodSelectorView';
    }
    return 'PaymentFormView';
};

export const useViewModel = (model: PaymentModel, condition: PaymentCondition) => {
    const [viewModel, dispatch] = useReducer(dataReducer, initViewModel(model));

    useEffect(() => {
        switch (condition.name) {
            case 'uninitialized':
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: applyUninitialized(model) });
                break;
            case 'invoiceStatusChanged':
            case 'paymentStatusChanged':
            case 'paymentStarted':
                dispatch({ type: 'SET_LOADING', payload: false });
                dispatch({ type: 'SET_VIEW', payload: { name: 'PaymentResultView' } });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'PaymentResultView' });
                break;
            case 'paymentProcessFailed':
                dispatch({ type: 'SET_LOADING', payload: false });
                throw new Error('Unimplemented paymentProcessFailed condition');
                break;
            case 'pending':
                dispatch({ type: 'SET_LOADING', payload: true });
                break;
        }
    }, [condition]);

    useEffect(() => {
        if (condition.name !== 'interactionRequested') return;
        dispatch({ type: 'SET_LOADING', payload: false });
        const interaction = condition.interaction;
        switch (interaction.type) {
            case 'PaymentInteractionQRCode':
                dispatch({ type: 'SET_VIEW', payload: { name: 'QrCodeView' } });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'QrCodeView' });
                break;
            case 'PaymentInteractionApiExtension':
                dispatch({ type: 'SET_VIEW', payload: { name: 'ApiExtensionView' } });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'ApiExtensionView' });
                break;
        }
    }, [condition]);

    const goTo = useCallback((viewName: ViewName, direction: SlideAnimationDirection = 'forward') => {
        dispatch({ type: 'GO_TO', payload: { viewName, direction } });
    }, []);

    return { viewModel, goTo };
};
