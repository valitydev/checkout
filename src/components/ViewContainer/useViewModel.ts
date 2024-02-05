import { useEffect, useMemo, useReducer } from 'react';

import { SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentCondition, PaymentInteractionRequested } from '../../common/paymentCondition';
import { PaymentMethod } from '../../common/paymentModel';
import { isNil, last } from '../../common/utils';

type Action =
    | {
          type: 'SET_ACTIVE_VIEW_ID';
          payload: string;
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
          type: 'SET_DIRECTION';
          payload: SlideAnimationDirection;
      }
    | {
          type: 'SET_PREVIOUS_VIEW_ID';
          payload: string | null;
      };

const dataReducer = (state: ViewModel, action: Action): ViewModel => {
    switch (action.type) {
        case 'SET_ACTIVE_VIEW_ID':
            return {
                ...state,
                activeViewId: action.payload,
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
        case 'SET_DIRECTION':
            return {
                ...state,
                direction: action.payload,
            };
        case 'SET_PREVIOUS_VIEW_ID':
            return {
                ...state,
                previousViewId: action.payload,
            };
        default:
            return state;
    }
};

const toViews = (paymentMethods: PaymentMethod[]): Map<string, View> => {
    let views: View[] = [];
    if (paymentMethods.length === 0) {
        views = [{ name: 'NoAvailablePaymentMethodsView', id: 'NoAvailablePaymentMethodsView' }];
    }
    if (paymentMethods.length > 1) {
        views = [{ name: 'PaymentMethodSelectorView', paymentMethods, id: 'PaymentMethodSelectorView' }];
    }
    views = paymentMethods.reduce<View[]>((acc, paymentMethod, key) => {
        const { methodName } = paymentMethod;
        switch (methodName) {
            case 'BankCard':
                return acc.concat([{ name: 'PaymentFormView', methodName, id: `PaymentFormView_${key}` }]);
            case 'PaymentTerminal':
                const { providers, category } = paymentMethod;
                if (providers.length === 1) {
                    return acc.concat([
                        {
                            name: 'PaymentFormView',
                            methodName,
                            provider: providers[0],
                            id: `PaymentFormView_${key}`,
                        },
                    ]);
                }
                return acc.concat([
                    { name: 'TerminalSelectorView', providers, category, id: `PaymentFormView_${key}` },
                ]);
            default:
                return acc;
        }
    }, views);
    const wrapToMapValue = (view: View): [string, View] => [view.id, view];
    return new Map(views.map(wrapToMapValue));
};

// TODO need refactoring
const toActiveView = (views: Map<string, View>): ViewName => {
    if (views.has('NoAvailablePaymentMethodsView')) {
        return 'NoAvailablePaymentMethodsView';
    }
    if (views.has('PaymentMethodSelectorView')) {
        return 'PaymentMethodSelectorView';
    }
    if (views.has('TerminalSelectorView')) {
        return 'TerminalSelectorView';
    }
    if (views.has('PaymentFormView')) {
        return 'PaymentFormView';
    }
};

const initViewModel = (paymentMethods: PaymentMethod[]): ViewModel => {
    const views = toViews(paymentMethods);
    return {
        isLoading: false,
        direction: 'none',
        views,
        activeViewId: toActiveView(views),
        previousViewId: null,
    };
};

const interactionToView = ({ interaction }: PaymentInteractionRequested): View => {
    switch (interaction.type) {
        case 'PaymentInteractionQRCode':
            return { name: 'QrCodeView', id: 'QrCodeView' };
        case 'PaymentInteractionApiExtension':
            return { name: 'ApiExtensionView', id: 'ApiExtensionView' };
    }
};

export const useViewModel = (paymentMethods: PaymentMethod[], conditions: PaymentCondition[]) => {
    const [viewModel, dispatch] = useReducer(dataReducer, initViewModel(paymentMethods));

    const lastCondition = useMemo(() => last(conditions), [conditions]);

    useEffect(() => {
        if (isNil(lastCondition)) return;
        switch (lastCondition.name) {
            case 'paymentProcessStarted':
                dispatch({ type: 'SET_LOADING', payload: true });
                break;
            default:
                dispatch({ type: 'SET_LOADING', payload: false });
                break;
        }
    }, [lastCondition]);

    useEffect(() => {
        if (isNil(lastCondition)) return;
        switch (lastCondition.name) {
            case 'invoiceStatusChanged':
            case 'paymentStatusChanged':
            case 'interactionCompleted':
            case 'paymentStatusUnknown':
            case 'paymentStarted':
                dispatch({ type: 'SET_VIEW', payload: { name: 'PaymentResultView', id: 'PaymentResultView' } });
                dispatch({ type: 'SET_DIRECTION', payload: 'forward' });
                dispatch({ type: 'SET_ACTIVE_VIEW_ID', payload: 'PaymentResultView' });
                break;
            case 'paymentProcessFailed':
                throw new Error('Unimplemented paymentProcessFailed condition');
            case 'interactionRequested':
                const interactionView = interactionToView(lastCondition);
                dispatch({ type: 'SET_VIEW', payload: interactionView });
                dispatch({ type: 'SET_DIRECTION', payload: 'forward' });
                dispatch({ type: 'SET_ACTIVE_VIEW_ID', payload: interactionView.name });
                break;
        }
    }, [lastCondition]);

    const goTo = (viewId: string, direction: SlideAnimationDirection = 'forward') => {
        if (viewId === viewModel.previousViewId) {
            dispatch({ type: 'SET_PREVIOUS_VIEW_ID', payload: null });
        }
        if (isNil(viewModel.previousViewId)) {
            dispatch({ type: 'SET_PREVIOUS_VIEW_ID', payload: viewModel.activeViewId });
        }
        dispatch({ type: 'SET_DIRECTION', payload: direction });
        dispatch({ type: 'SET_ACTIVE_VIEW_ID', payload: viewId });
    };

    return { viewModel, goTo };
};
