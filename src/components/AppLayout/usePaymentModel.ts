import { useCallback, useReducer } from 'react';

import { InitParams } from 'checkout/initialize';

import { initPaymentModel, PaymentModel } from '../../common/paymentModel';

type PaymentModelState =
    | { status: 'PROCESSING' }
    | { status: 'INITIALIZED'; data: PaymentModel }
    | { status: 'FAILURE' };

type Action = { type: 'INIT_STARTED' } | { type: 'INIT_SUCCESS'; payload: PaymentModel };

const dataReducer = (state: PaymentModelState, action: Action): PaymentModelState => {
    switch (action.type) {
        case 'INIT_STARTED':
            return {
                ...state,
                status: 'PROCESSING',
            };
        case 'INIT_SUCCESS':
            return {
                ...state,
                status: 'INITIALIZED',
                data: action.payload,
            };
        default:
            return state;
    }
};

export const usePaymentModel = () => {
    const [paymentModelState, dispatch] = useReducer(dataReducer, {
        status: 'PROCESSING',
    });

    const init = useCallback((initParams: InitParams) => {
        (async () => {
            dispatch({ type: 'INIT_STARTED' });
            const payload = await initPaymentModel(initParams);
            dispatch({
                type: 'INIT_SUCCESS',
                payload,
            });
        })();
    }, []);

    return { paymentModelState, init };
};
