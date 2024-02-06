import { useEffect, useMemo, useReducer } from 'react';

import {
    PaymentFormView,
    PaymentMethodSelectorItem,
    SlideAnimationDirection,
    TerminalSelectorView,
    View,
    ViewModel,
} from './types';
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

const toViews = (paymentMethods: PaymentMethod[]): [Map<string, View>, string] => {
    const wrapToMapValue = (view: View): [string, View] => [view.id, view];

    if (paymentMethods.length === 0) {
        return [
            new Map(
                [{ name: 'NoAvailablePaymentMethodsView', id: 'NoAvailablePaymentMethodsView' }].map(wrapToMapValue),
            ),
            'NoAvailablePaymentMethodsView',
        ];
    }

    const [views, pmSelectorItems, viewId] = paymentMethods.reduce<[View[], PaymentMethodSelectorItem[], string]>(
        ([views, pmSelectorItems, viewId], paymentMethod, key) => {
            const { methodName } = paymentMethod;
            switch (methodName) {
                case 'BankCard':
                    const bankCardId = `PaymentFormView_${key}`;
                    const bankCardView: PaymentFormView = { name: 'PaymentFormView', id: bankCardId, methodName };
                    const bankCardSelectorItem: PaymentMethodSelectorItem = { name: methodName, viewId: bankCardId };
                    return [[...views, bankCardView], [...pmSelectorItems, bankCardSelectorItem], bankCardId];
                case 'PaymentTerminal':
                    const { providers, category } = paymentMethod;

                    if (providers.length === 1) {
                        const singleProviderTerminalId = `PaymentFormView_${key}`;
                        const singleProviderTerminalView: PaymentFormView = {
                            name: 'PaymentFormView',
                            id: singleProviderTerminalId,
                            methodName,
                            provider: providers[0],
                        };
                        const singleProviderSelectorItem: PaymentMethodSelectorItem = {
                            name: methodName,
                            viewId: singleProviderTerminalId,
                            provider: providers[0],
                        };
                        return [
                            [...views, singleProviderTerminalView],
                            [...pmSelectorItems, singleProviderSelectorItem],
                            singleProviderTerminalId,
                        ];
                    }

                    const paymentTerminalViews: PaymentFormView[] = providers.map((provider, providerKey) => ({
                        name: 'PaymentFormView',
                        id: `PaymentFormView_${key}_${providerKey}`,
                        methodName,
                        provider,
                    }));
                    const terminalSelectorId = `TerminalSelectorView_${key}`;
                    const terminalSelectorView: TerminalSelectorView = {
                        name: 'TerminalSelectorView',
                        id: terminalSelectorId,
                        category,
                        items: paymentTerminalViews.map(({ id, provider }) => ({ viewId: id, provider })),
                    };
                    const terminalSelectorItem: PaymentMethodSelectorItem = {
                        name: 'TerminalSelector',
                        viewId: terminalSelectorId,
                    };
                    return [
                        [...views, ...paymentTerminalViews, terminalSelectorView],
                        [...pmSelectorItems, terminalSelectorItem],
                        terminalSelectorId,
                    ];
                default:
                    return [views, pmSelectorItems, viewId];
            }
        },
        [[], [], ''],
    );

    let activeViewId = viewId;
    if (pmSelectorItems.length > 1) {
        views.push({ name: 'PaymentMethodSelectorView', id: 'PaymentMethodSelectorView', items: pmSelectorItems });
        activeViewId = 'PaymentMethodSelectorView';
    }

    return [new Map(views.map(wrapToMapValue)), activeViewId];
};

const initViewModel = (paymentMethods: PaymentMethod[]): ViewModel => {
    const [views, activeViewId] = toViews(paymentMethods);
    return {
        isLoading: false,
        direction: 'none',
        views,
        activeViewId,
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
