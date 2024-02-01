import { useCallback, useReducer } from 'react';

import { InitParams } from 'checkout/initialize';

import { initPaymentCondition, PaymentCondition } from '../../common/paymentCondition';
import { initPaymentModel, PaymentModel } from '../../common/paymentModel';

type ModelsStateData = {
    paymentModel: PaymentModel;
    conditions: PaymentCondition[];
};

type ModelsState = { status: 'PROCESSING' } | { status: 'INITIALIZED'; data: ModelsStateData } | { status: 'FAILURE' };

type Action = { type: 'INIT_STARTED' } | { type: 'INIT_SUCCESS'; payload: ModelsStateData } | { type: 'INIT_FAILED' };

const dataReducer = (state: ModelsState, action: Action): ModelsState => {
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
        case 'INIT_FAILED':
            return {
                ...state,
                status: 'FAILURE',
            };
        default:
            return state;
    }
};

export const useInitModels = () => {
    const [modelsState, dispatch] = useReducer(dataReducer, {
        status: 'PROCESSING',
    });

    const init = useCallback((initParams: InitParams) => {
        (async () => {
            dispatch({ type: 'INIT_STARTED' });
            try {
                const paymentModel = await initPaymentModel(initParams);
                const conditions = await initPaymentCondition(paymentModel);
                dispatch({
                    type: 'INIT_SUCCESS',
                    payload: { paymentModel, conditions },
                });
            } catch (ex) {
                console.error(ex);
                dispatch({ type: 'INIT_FAILED' });
            }
        })();
    }, []);

    return { modelsState, init };
};
