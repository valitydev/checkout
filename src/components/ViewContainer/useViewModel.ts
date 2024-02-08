import { useEffect, useMemo, useReducer } from 'react';

import { PaymentFormView, PaymentMethodSelectorItem, TerminalSelectorView, View, ViewModel } from './types';
import { PaymentCondition, PaymentInteractionRequested } from '../../common/paymentCondition';
import { PaymentMethod } from '../../common/paymentModel';
import { isNil, last } from '../../common/utils';

type Action =
    | {
          type: 'SET_VIEW';
          payload: View;
      }
    | {
          type: 'SET_LOADING';
          payload: boolean;
      }
    | {
          type: 'FORWARD';
          payload: string;
      }
    | {
          type: 'BACKWARD';
      }
    | { type: 'GO_TO'; payload: string };

const setView = (state: ViewModel, view: View): ViewModel => ({
    ...state,
    views: state.views.set(view.id, view),
    activeViewId: view.id,
    direction: 'none',
});

const forward = (state: ViewModel, viewId: string): ViewModel => {
    const history = state.history.concat();
    history.push(state.activeViewId);
    return {
        ...state,
        activeViewId: viewId,
        direction: 'forward',
        history,
        hasBackward: true,
    };
};

const backward = (state: ViewModel): ViewModel => {
    if (!state.hasBackward) return state;
    const history = state.history.concat();
    const activeViewId = history.pop();
    return {
        ...state,
        activeViewId,
        direction: 'backward',
        history,
        hasBackward: history.length > 0,
    };
};

const goTo = (state: ViewModel, viewId: string): ViewModel => {
    const foundIndex = state.history.findIndex((id) => id === viewId);
    if (foundIndex === -1) return state;
    return {
        ...state,
        history: state.history.slice(0, foundIndex + 1),
        activeViewId: viewId,
        direction: 'backward',
    };
};

const setIsLoading = (state: ViewModel, isLoading: boolean): ViewModel => ({
    ...state,
    isLoading,
});

const dataReducer = (state: ViewModel, action: Action): ViewModel => {
    switch (action.type) {
        case 'SET_VIEW':
            return setView(state, action.payload);
        case 'SET_LOADING':
            return setIsLoading(state, action.payload);
        case 'FORWARD':
            return forward(state, action.payload);
        case 'BACKWARD':
            return backward(state);
        case 'GO_TO':
            return goTo(state, action.payload);
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
        history: [],
        hasBackward: false,
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
                break;
            case 'interactionRequested':
                const interactionView = interactionToView(lastCondition);
                dispatch({ type: 'SET_VIEW', payload: interactionView });
                break;
            case 'paymentProcessFailed':
                dispatch({
                    type: 'SET_VIEW',
                    payload: { name: 'PaymentProcessFailedView', id: 'PaymentProcessFailedView' },
                });
        }
    }, [lastCondition]);

    const forward = (viewId: string) => {
        dispatch({ type: 'FORWARD', payload: viewId });
    };

    const backward = () => {
        dispatch({ type: 'BACKWARD' });
    };

    const goTo = (viewId: string) => {
        dispatch({ type: 'GO_TO', payload: viewId });
    };

    return { viewModel, goTo, forward, backward };
};
