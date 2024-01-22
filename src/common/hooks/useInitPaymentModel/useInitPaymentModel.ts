import { useCallback, useReducer } from 'react';

import { InitParams } from 'checkout/initialize';

import { initPaymentModel as initModel } from './initPaymentModel';
import { PaymentModel } from './types';

type State = { status: 'PROCESSING' } | { status: 'STANDBY'; data: PaymentModel } | { status: 'FAILURE' };

type Action = { type: 'INIT_STARTED' } | { type: 'INIT_SUCCESS'; payload: PaymentModel };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'INIT_STARTED':
            return {
                ...state,
                status: 'PROCESSING',
            };
        case 'INIT_SUCCESS':
            return {
                ...state,
                status: 'STANDBY',
                data: action.payload,
            };
        default:
            return state;
    }
};

export const useInitPaymentModel = () => {
    const [state, dispatch] = useReducer(dataReducer, {
        status: 'PROCESSING',
    });

    const init = useCallback((initParams: InitParams) => {
        (async () => {
            dispatch({ type: 'INIT_STARTED' });
            const payload = await initModel(initParams);
            dispatch({
                type: 'INIT_SUCCESS',
                payload,
            });
        })();
    }, []);

    return { state, init };
};
