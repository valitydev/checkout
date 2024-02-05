import { useEffect, useMemo, useReducer } from 'react';

import { SlideAnimationDirection, View, ViewModel, ViewName } from './types';
import { PaymentCondition, PaymentInteractionRequested } from '../../common/paymentCondition';
import { PaymentMethod } from '../../common/paymentModel';
import { isNil, last } from '../../common/utils';

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
          type: 'SET_DIRECTION';
          payload: SlideAnimationDirection;
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
        case 'SET_DIRECTION':
            return {
                ...state,
                direction: action.payload,
            };
        default:
            return state;
    }
};

const toViews = (paymentMethods: PaymentMethod[]): Map<ViewName, View> => {
    let views: View[] = [];
    if (paymentMethods.length === 0) {
        views = [{ name: 'NoAvailablePaymentMethodsView' }];
    }
    if (paymentMethods.length > 1) {
        views = [{ name: 'PaymentMethodSelectorView', paymentMethods }];
    }
    views = paymentMethods.reduce<View[]>((acc, paymentMethod) => {
        const { methodName } = paymentMethod;
        switch (methodName) {
            case 'BankCard':
                return acc.concat([{ name: 'PaymentFormView', methodName }]);
            case 'PaymentTerminal':
                const { providers, category } = paymentMethod;
                if (providers.length === 1) {
                    return acc.concat([{ name: 'PaymentFormView', methodName, provider: providers[0] }]);
                }
                return acc.concat([{ name: 'TerminalSelectorView', providers, category }]);
            default:
                return acc;
        }
    }, views);
    const wrapToMapValue = (view: View): [ViewName, View] => [view.name, view];
    return new Map(views.map(wrapToMapValue));
};

const toActiveView = (views: Map<ViewName, View>): ViewName => {
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
        activeView: toActiveView(views),
    };
};

const interactionToView = ({ interaction }: PaymentInteractionRequested): View => {
    switch (interaction.type) {
        case 'PaymentInteractionQRCode':
            return { name: 'QrCodeView' };
        case 'PaymentInteractionApiExtension':
            return { name: 'ApiExtensionView' };
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
                dispatch({ type: 'SET_VIEW', payload: { name: 'PaymentResultView' } });
                dispatch({ type: 'SET_DIRECTION', payload: 'forward' });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'PaymentResultView' });
                break;
            case 'paymentProcessFailed':
                throw new Error('Unimplemented paymentProcessFailed condition');
            case 'interactionRequested':
                const interactionView = interactionToView(lastCondition);
                dispatch({ type: 'SET_VIEW', payload: interactionView });
                dispatch({ type: 'SET_DIRECTION', payload: 'forward' });
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: interactionView.name });
                break;
        }
    }, [lastCondition]);

    return { viewModel };
};
